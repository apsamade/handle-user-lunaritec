import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/utils/connectToDB';
import User from '@/models/user';
import Token from '@/models/token';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token et mot de passe requis." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Le mot de passe doit contenir au moins 6 caractères." },
                { status: 400 }
            );
        }

        // Chercher le token dans la base de données
        const resetToken = await Token.findOne({ 
            token: token, 
            type: 'reset',
            expires: false,
            expiresAt: { $gt: new Date() } // Token non expiré
        }).populate('userId');

        if (!resetToken) {
            return NextResponse.json(
                { error: "Token invalide ou expiré." },
                { status: 400 }
            );
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Mettre à jour le mot de passe de l'utilisateur
        await User.findByIdAndUpdate(resetToken.userId._id, {
            mdp: hashedPassword
        });

        // Marquer le token comme utilisé et supprimer tous les tokens de réinitialisation pour cet utilisateur
        await Token.deleteMany({ 
            userId: resetToken.userId._id, 
            type: 'reset' 
        });

        return NextResponse.json(
            { message: "Mot de passe réinitialisé avec succès." },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la réinitialisation du mot de passe." },
            { status: 500 }
        );
    }
} 