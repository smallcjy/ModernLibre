'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { revalidatePath } from 'next/cache';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    useEffect(() => {
        if (code && state) {
            const fetchData = async () => {
                try {
                    const authUrl = `${window.location.origin}/api/oauth/casdoor/callback?code=${code}&state=${state}`;
                    const response = await fetch(authUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    const { user, token } = data;

                    // Handle user and token as needed
                    toast.success(`Welcome ${user.name}`);
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    router.refresh();
                    router.push('/');
                    revalidatePath('/');
                } catch (error) {
                    console.error(error);
                    toast.error('Authentication failed');
                }
            };

            fetchData();
        }
    }, [code, state, router]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>Authenticating...</div>
        </Suspense>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
