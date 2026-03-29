/**
 * Shared footer for all pages on The Brief You Deserved resource site.
 * Include this script at the bottom of every HTML page.
 * It replaces any element with class "footer" with the full shared footer.
 */
(function() {
  var footerHTML = '' +
    '<div class="shared-footer">' +

    // Quick Links
    '<div class="quick-links">' +
    '<h4>Official Resources</h4>' +
    '<div class="link-grid">' +
    '<a href="https://www.va.gov/" target="_blank">VA.gov</a>' +
    '<a href="https://www.va.gov/disability/" target="_blank">VA Disability</a>' +
    '<a href="https://www.va.gov/education/" target="_blank">VA Education</a>' +
    '<a href="https://www.va.gov/health-care/" target="_blank">VA Healthcare</a>' +
    '<a href="https://www.tsp.gov/" target="_blank">TSP.gov</a>' +
    '<a href="https://www.tricare.mil/" target="_blank">TRICARE</a>' +
    '<a href="https://www.dfas.mil/retiredmilitary/" target="_blank">DFAS (Pay)</a>' +
    '<a href="https://milconnect.dmdc.osd.mil/" target="_blank">milConnect</a>' +
    '<a href="https://www.ebenefits.va.gov/" target="_blank">eBenefits</a>' +
    '<a href="https://skillbridge.osd.mil/" target="_blank">SkillBridge</a>' +
    '<a href="https://www.militaryonesource.mil/" target="_blank">Military OneSource</a>' +
    '<a href="https://www.dodtap.mil/" target="_blank">TAP</a>' +
    '</div>' +
    '</div>' +

    // Report & Errata
    '<div class="report-bar">' +
    '<span>Found an error or outdated info?</span> ' +
    '<a href="errata.html" class="report-link">Report it &rarr;</a>' +
    '</div>' +

    // Crisis line
    '<div class="crisis-line">' +
    '<strong>Veterans Crisis Line: 988 (press 1) | Text: 838255</strong>' +
    '</div>' +

    // Copyright
    '<div class="copyright">' +
    '<p>&copy; The Brief You Deserved &middot; <a href="mailto:the.brief.you.deserved@gmail.com">the.brief.you.deserved@gmail.com</a></p>' +
    '<p><a href="index.html">Resource Hub</a> &middot; <a href="errata.html">Errata</a></p>' +
    '</div>' +

    '</div>';

  var style = document.createElement('style');
  style.textContent = '' +
    '.shared-footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #c5a55a; }' +
    '.quick-links { margin: 20px 0; }' +
    '.quick-links h4 { color: #1a1a2e; margin: 0 0 10px; font-size: 1em; }' +
    '.link-grid { display: flex; flex-wrap: wrap; gap: 8px; }' +
    '.link-grid a { display: inline-block; padding: 4px 12px; background: #fff; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #1a1a2e; font-size: 0.85em; transition: all 0.15s; }' +
    '.link-grid a:hover { border-color: #c5a55a; background: #c5a55a; color: #1a1a2e; }' +
    '.report-bar { background: #fff3cd; border-radius: 6px; padding: 12px 18px; margin: 20px 0; text-align: center; font-size: 0.9em; }' +
    '.report-bar span { color: #856404; }' +
    '.report-link { color: #1a1a2e; font-weight: bold; text-decoration: none; margin-left: 8px; }' +
    '.report-link:hover { text-decoration: underline; }' +
    '.crisis-line { text-align: center; background: #f8d7da; border-radius: 6px; padding: 10px; margin: 15px 0; font-size: 0.9em; color: #721c24; }' +
    '.copyright { text-align: center; font-size: 0.85em; color: #999; margin-top: 20px; }' +
    '.copyright a { color: #c5a55a; text-decoration: none; }' +
    '.copyright a:hover { text-decoration: underline; }';
  document.head.appendChild(style);

  // Replace existing footer
  var existingFooter = document.querySelector('.footer');
  if (existingFooter) {
    existingFooter.outerHTML = footerHTML;
  } else {
    // Append before closing container div
    var container = document.querySelector('.container');
    if (container) {
      container.insertAdjacentHTML('beforeend', footerHTML);
    }
  }

  console.log('[Footer] Shared footer loaded');
})();
