#!/usr/bin/env bash
# =============================================================================
# Full-site URL validation for vegaselectricianservice.com
# Tests: canonical pages return 200, redirect URLs return 301 to correct target
# Usage: chmod +x validate-urls.sh && ./validate-urls.sh
# =============================================================================

BASE="https://vegaselectricianservice.com"
PASS=0
FAIL=0

green="\033[0;32m"
red="\033[0;31m"
yellow="\033[0;33m"
reset="\033[0m"

check_200() {
  local url="$1"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  if [ "$status" = "200" ]; then
    echo -e "${green}✓ 200${reset}  $url"
    ((PASS++))
  else
    echo -e "${red}✗ $status${reset}  $url  (expected 200)"
    ((FAIL++))
  fi
}

check_301() {
  local url="$1"
  local expected_dest="$2"
  local status
  local location
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -L0 "$url")
  location=$(curl -s -o /dev/null -w "%{redirect_url}" --max-time 10 "$url")
  if [ "$status" = "301" ] && [ "$location" = "$expected_dest" ]; then
    echo -e "${green}✓ 301${reset}  $url  →  $location"
    ((PASS++))
  elif [ "$status" = "301" ]; then
    echo -e "${yellow}~ 301${reset}  $url  →  $location  (expected: $expected_dest)"
    ((FAIL++))
  else
    echo -e "${red}✗ $status${reset}  $url  (expected 301 → $expected_dest)"
    ((FAIL++))
  fi
}

echo "============================================================"
echo " SECTION 1 — Canonical pages must return HTTP 200"
echo "============================================================"

CANONICAL_PAGES=(
  "/"
  "/about/"
  "/contact/"
  "/electrical-services-las-vegas/"
  "/residential-electrical-services/"
  "/commercial-electrical-services/"
  "/emergency-electrician-las-vegas/"
  "/electrical-panel-upgrade/"
  "/circuit-breaker-repair/"
  "/ceiling-fan-installation/"
  "/lighting-installation/"
  "/electrical-wiring-rewiring/"
  "/ev-charger-installation/"
  "/gfci-outlet-installation/"
  "/electrical-inspection-troubleshooting/"
  "/service-areas-las-vegas/"
  "/electrician-in-henderson-nv/"
  "/electrician-in-summerlin-nv/"
  "/electrician-in-north-las-vegas-nv/"
  "/electrician-in-paradise-nv/"
  "/electrician-in-spring-valley-nv/"
)

for path in "${CANONICAL_PAGES[@]}"; do
  check_200 "${BASE}${path}"
done

echo ""
echo "============================================================"
echo " SECTION 2 — .html URLs must 301 redirect to trailing slash"
echo "============================================================"

declare -A HTML_REDIRECTS=(
  ["/index.html"]="$BASE/"
  ["/about.html"]="$BASE/about/"
  ["/contact.html"]="$BASE/contact/"
  ["/privacy-policy.html"]="$BASE/privacy-policy/"
  ["/electrical-services-las-vegas.html"]="$BASE/electrical-services-las-vegas/"
  ["/residential-electrical-services.html"]="$BASE/residential-electrical-services/"
  ["/commercial-electrical-services.html"]="$BASE/commercial-electrical-services/"
  ["/emergency-electrician-las-vegas.html"]="$BASE/emergency-electrician-las-vegas/"
  ["/electrical-panel-upgrade.html"]="$BASE/electrical-panel-upgrade/"
  ["/circuit-breaker-repair.html"]="$BASE/circuit-breaker-repair/"
  ["/ceiling-fan-installation.html"]="$BASE/ceiling-fan-installation/"
  ["/lighting-installation.html"]="$BASE/lighting-installation/"
  ["/electrical-wiring-rewiring.html"]="$BASE/electrical-wiring-rewiring/"
  ["/ev-charger-installation.html"]="$BASE/ev-charger-installation/"
  ["/gfci-outlet-installation.html"]="$BASE/gfci-outlet-installation/"
  ["/electrical-inspection-troubleshooting.html"]="$BASE/electrical-inspection-troubleshooting/"
  ["/service-areas-las-vegas.html"]="$BASE/service-areas-las-vegas/"
  ["/electrician-in-henderson-nv.html"]="$BASE/electrician-in-henderson-nv/"
  ["/electrician-in-summerlin-nv.html"]="$BASE/electrician-in-summerlin-nv/"
  ["/electrician-in-north-las-vegas-nv.html"]="$BASE/electrician-in-north-las-vegas-nv/"
  ["/electrician-in-paradise-nv.html"]="$BASE/electrician-in-paradise-nv/"
  ["/electrician-in-spring-valley-nv.html"]="$BASE/electrician-in-spring-valley-nv/"
)

for path in "${!HTML_REDIRECTS[@]}"; do
  check_301 "${BASE}${path}" "${HTML_REDIRECTS[$path]}"
done

echo ""
echo "============================================================"
echo " SECTION 3 — Bare slugs (no trailing slash) must 301 redirect"
echo "============================================================"

declare -A SLUG_REDIRECTS=(
  ["/about"]="$BASE/about/"
  ["/contact"]="$BASE/contact/"
  ["/electrical-services-las-vegas"]="$BASE/electrical-services-las-vegas/"
  ["/residential-electrical-services"]="$BASE/residential-electrical-services/"
  ["/commercial-electrical-services"]="$BASE/commercial-electrical-services/"
  ["/emergency-electrician-las-vegas"]="$BASE/emergency-electrician-las-vegas/"
  ["/electrical-panel-upgrade"]="$BASE/electrical-panel-upgrade/"
  ["/circuit-breaker-repair"]="$BASE/circuit-breaker-repair/"
  ["/ceiling-fan-installation"]="$BASE/ceiling-fan-installation/"
  ["/lighting-installation"]="$BASE/lighting-installation/"
  ["/electrical-wiring-rewiring"]="$BASE/electrical-wiring-rewiring/"
  ["/ev-charger-installation"]="$BASE/ev-charger-installation/"
  ["/gfci-outlet-installation"]="$BASE/gfci-outlet-installation/"
  ["/electrical-inspection-troubleshooting"]="$BASE/electrical-inspection-troubleshooting/"
  ["/service-areas-las-vegas"]="$BASE/service-areas-las-vegas/"
  ["/electrician-in-henderson-nv"]="$BASE/electrician-in-henderson-nv/"
  ["/electrician-in-summerlin-nv"]="$BASE/electrician-in-summerlin-nv/"
  ["/electrician-in-north-las-vegas-nv"]="$BASE/electrician-in-north-las-vegas-nv/"
  ["/electrician-in-paradise-nv"]="$BASE/electrician-in-paradise-nv/"
  ["/electrician-in-spring-valley-nv"]="$BASE/electrician-in-spring-valley-nv/"
)

for path in "${!SLUG_REDIRECTS[@]}"; do
  check_301 "${BASE}${path}" "${SLUG_REDIRECTS[$path]}"
done

echo ""
echo "============================================================"
echo " SECTION 4 — Canonical tag audit (must match URL)"
echo "============================================================"

for path in "${CANONICAL_PAGES[@]}"; do
  url="${BASE}${path}"
  canonical=$(curl -s --max-time 10 "$url" | grep -oP '(?<=<link rel="canonical" href=")[^"]+')
  if [ "$canonical" = "$url" ]; then
    echo -e "${green}✓ canonical${reset}  $url  =  $canonical"
    ((PASS++))
  else
    echo -e "${red}✗ canonical mismatch${reset}  URL: $url  |  tag: $canonical"
    ((FAIL++))
  fi
done

echo ""
echo "============================================================"
echo " RESULTS"
echo "============================================================"
echo -e "${green}PASS: $PASS${reset}"
echo -e "${red}FAIL: $FAIL${reset}"
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "${green}All checks passed. Site is ready for re-validation in Google Search Console.${reset}"
else
  echo -e "${red}$FAIL check(s) failed. Fix the above before resubmitting to GSC.${reset}"
fi
