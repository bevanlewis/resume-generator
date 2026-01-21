import { NextResponse } from 'next/server';

// Using latex.ytotech.com API for free LaTeX compilation
const LATEX_API_URL = 'https://latex.ytotech.com/builds/sync';

export async function POST(request: Request) {
  try {
    const { latex } = await request.json();

    if (!latex) {
      return NextResponse.json(
        { error: 'No LaTeX code provided' },
        { status: 400 }
      );
    }

    // Send LaTeX to the compilation API
    const response = await fetch(LATEX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          {
            main: true,
            content: latex,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LaTeX compilation error:', errorText);
      return NextResponse.json(
        { error: 'LaTeX compilation failed', details: errorText },
        { status: 500 }
      );
    }

    // Get the PDF as a buffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Convert to base64 for easy transmission
    const base64 = Buffer.from(pdfBuffer).toString('base64');

    return NextResponse.json({ 
      pdf: base64,
      contentType: 'application/pdf'
    });
  } catch (error) {
    console.error('Error compiling PDF:', error);
    return NextResponse.json(
      { error: 'Failed to compile PDF' },
      { status: 500 }
    );
  }
}
