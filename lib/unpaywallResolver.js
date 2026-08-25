/**
 * Unpaywall & PMC Open Access PDF Resolver
 * Resolves free open-access PDF URLs given a DOI or PMID.
 */

export async function resolveOpenAccessPdf({ doi = "", pmid = "" }) {
  let cleanDoi = (doi || "").trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

  // 1. If DOI is missing but PMID is provided, resolve DOI from PubMed E-Utilities
  if (!cleanDoi && pmid) {
    try {
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
      const res = await fetch(summaryUrl);
      const data = await res.json();
      const article = data?.result?.[pmid];
      if (article && article.articleids) {
        const doiItem = article.articleids.find((id) => id.idtype === "doi");
        if (doiItem) cleanDoi = doiItem.value;
      }
    } catch (err) {
      console.warn("Error resolving DOI from PMID:", err);
    }
  }

  // 2. Try Unpaywall API if DOI exists
  if (cleanDoi) {
    try {
      const unpaywallUrl = `https://api.unpaywall.org/v2/${encodeURIComponent(cleanDoi)}?email=developer@bioconnect.ai`;
      const res = await fetch(unpaywallUrl);
      if (res.ok) {
        const data = await res.json();
        const pdfUrl = data?.best_oa_location?.url_for_pdf || data?.best_oa_location?.url;
        
        if (data?.is_oa && pdfUrl) {
          return {
            is_oa: true,
            pdf_url: pdfUrl,
            doi: cleanDoi,
            oa_status: data?.oa_status || "gold",
            title: data?.title || "",
            publisher: data?.publisher || ""
          };
        }
      }
    } catch (err) {
      console.warn("Unpaywall API error:", err);
    }
  }

  // 3. PMC Fallback: If PMID is present, check PubMed Central for direct free PDF/HTML link
  if (pmid) {
    try {
      const pmcCheckUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&id=${pmid}&db=pmc&retmode=json`;
      const res = await fetch(pmcCheckUrl);
      const data = await res.json();
      const linkset = data?.linksets?.[0];
      const pmcIdObj = linkset?.linksetdbs?.find((l) => l.db === "pmc");
      if (pmcIdObj && pmcIdObj.links && pmcIdObj.links.length > 0) {
        const pmcId = pmcIdObj.links[0];
        return {
          is_oa: true,
          pdf_url: `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${pmcId}/pdf/`,
          pmcid: `PMC${pmcId}`,
          doi: cleanDoi,
          oa_status: "green"
        };
      }
    } catch (err) {
      console.warn("PMC Fallback error:", err);
    }
  }

  // 4. Paywalled Fallback
  return {
    is_oa: false,
    pdf_url: null,
    doi: cleanDoi,
    publisher_url: cleanDoi ? `https://doi.org/${cleanDoi}` : (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : null),
    oa_status: "closed"
  };
}
