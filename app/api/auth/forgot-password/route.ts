import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/utils/connect-to-db';
import User from '@/models/user';
import Token from '@/models/token';
import crypto from 'crypto';
import { createTransporter } from '@/utils/emailTransporter';

export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "L'adresse email est requise." },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: "Si cette adresse email existe dans notre base de données, vous recevrez un email de réinitialisation." },
                { status: 200 }
            );
        }

        await Token.deleteMany({ 
            userId: user._id, 
            type: 'reset' 
        });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);

        const token = new Token({
            userId: user._id,
            token: resetToken,
            type: 'reset',
            expiresAt: expiresAt,
            expires: false
        });

        await token.save();

        const transporter = createTransporter();
        const resetUrl = `${process.env.NEXTAUTH_URL}/connexion/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.MON_MAIL,
            to: email,
            subject: 'Réinitialisation de votre mot de passe - TATOS',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TATOS</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour,</h2>
                        
                        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; transition: all 0.3s ease;">
                                Réinitialiser mon mot de passe
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
                            Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                        </p>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
                            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                            <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
                        <p>Cordialement,<br>L'équipe TATOS</p>
                    </div>
                </div>
            `,
            text: `
                Bonjour,

                Vous avez demandé la réinitialisation de votre mot de passe.

                Cliquez sur le lien suivant pour créer un nouveau mot de passe :
                ${resetUrl}

                Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.

                Cordialement,
                L'équipe TATOS
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Un email de réinitialisation a été envoyé à votre adresse email." },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'envoi de l'email." },
            { status: 500 }
        );
    }
} 