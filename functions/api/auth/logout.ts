export async function onRequestPost() {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'सफलतापूर्वक लॉगआउट हो गया।',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'saathi_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      },
    }
  );
}
