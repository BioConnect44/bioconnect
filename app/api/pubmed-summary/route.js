import { GET as pubmedGET, POST as pubmedPOST } from "../pubmed/route";

export async function GET(request) {
  return pubmedGET(request);
}

export async function POST(request) {
  return pubmedPOST(request);
}
