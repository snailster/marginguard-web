import { NextResponse } from 'next/server';
import { calculateMargin } from '../../../lib/marginEngine';

export async function POST(req) {
  try {
    const { imageBase64, jobType = 'General Contractor', userPrompt = '' } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const promptText = `
      You are an expert construction cost estimator for ${jobType}.
      Analyze the provided site photo and description.
      Additional Context: ${userPrompt || 'None provided.'}

      Return a JSON object with this EXACT structure (no Markdown formatting, no code blocks):
      {
        "title": "Short title of work required",
        "description": "Summary of observations and necessary repair/build work",
        "laborHours": <estimated total hours as number>,
        "laborRatePerHour": <standard hourly rate as number, default 75>,
        "estimatedMaterialCost": <material cost as number>,
        "estimatedEquipmentCost": <equipment cost as number>,
        "lineItems": [
          { "description": "Item description", "estimatedCost": <number> }
        ]
      }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call Vision API');
    }

    const aiData = await response.json();
    const content = JSON.parse(aiData.choices[0].message.content);

    // Compute pricing and margins using marginEngine
    const laborCost = (content.laborHours || 0) * (content.laborRatePerHour || 75);
    const financialSummary = calculateContractMargin({
      laborCost,
      materialCost: content.estimatedMaterialCost || 0,
      equipmentCost: content.estimatedEquipmentCost || 0,
      contingencyPercent: 10,
      targetMarginPercent: 30,
    });

    return NextResponse.json({
      success: true,
      estimation: {
        ...content,
        financials: financialSummary,
      },
    });
  } catch (error) {
    console.error('Estimation API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}