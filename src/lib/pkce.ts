export function generateCodeVerifier(length: number = 128): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += possible[randomValues[i] % possible.length];
  }
  
  return result;
}

export function generateCodeChallenge(codeVerifier: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
    .then(buffer => {
      return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    });
}

export async function generateState(): Promise<string> {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues).map(b => b.toString(16).padStart(2, '0')).join('');
}
