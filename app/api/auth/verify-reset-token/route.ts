import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/utils/connectToDB';
import Token from '@/models/token';

export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: "Token requis." },
                { status: 400 }
            );
        }

        // Chercher le token dans la base de données
        const resetToken = await Token.findOne({ 
            token: token, 
            type: 'reset',
            expires: false,
            expiresAt: { $gt: new Date() } // Token non expiré
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: "Token invalide ou expiré." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Token valide." },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la vérification du token." },
            { status: 500 }
        );
    }
} 