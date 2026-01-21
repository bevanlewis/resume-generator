import { NextResponse } from 'next/server';
import { generateLatex } from '@/lib/latex-generator';
import { ResumeData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data: ResumeData = await request.json();
    const latex = generateLatex(data);
    
    return NextResponse.json({ latex });
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    return NextResponse.json(
      { error: 'Failed to generate LaTeX' },
      { status: 500 }
    );
  }
}
