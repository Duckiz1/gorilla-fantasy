import {originOK,cookieHeader} from '@/lib/server';
export async function POST(r:Request){if(!originOK(r))return new Response('Forbidden',{status:403});return new Response(null,{status:204,headers:{'Set-Cookie':cookieHeader(r,'gf_session','',0)}});}
