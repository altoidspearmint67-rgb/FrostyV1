// About:Blank Cloaking Feature - FORCED SECURITY FEATURE
// Opens site in about:blank popup to prevent history tracking
// This is NOT optional - always enabled for security

function initializeAboutBlank() {
  let inFrame;

  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }

  // FORCED: Always enable when not in frame and not Firefox
  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    // Small delay to ensure popups aren't immediately closed by browser
    setTimeout(() => {
      const popup = window.open("about:blank", "_blank");

      if (!popup || popup.closed) {
        console.warn("About:blank popup blocked. Please allow popups for this site.");
        // Silently fail - don't show alert to avoid disrupting user experience
      } else {
        try {
          const doc = popup.document;
          const iframe = doc.createElement("iframe");
          const style = iframe.style;
          const link = doc.createElement("link");

          // Get saved tab cloaker settings
          const name = localStorage.getItem("CustomName") || localStorage.getItem("name") || "My Drive - Google Drive";
          const icon = localStorage.getItem("CustomIcon") || localStorage.getItem("icon") || "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png";

          // Configure tab appearance in popup
          doc.title = name;
          link.rel = "icon";
          link.href = icon;

          // Configure iframe to fill entire window
          iframe.src = location.href;
          iframe.sandbox = "allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-modals allow-orientation-lock allow-presentation allow-storage-access-by-user-activation";
          style.position = "fixed";
          style.top = "0";
          style.bottom = "0";
          style.left = "0";
          style.right = "0";
          style.border = "none";
          style.outline = "none";
          style.width = "100%";
          style.height = "100%";

          // Get panic link (educational site to show when leaving)
          const pLink = localStorage.getItem("pLink") || getRandomEducationalUrl();
          
          // Append elements to popup document
          doc.head.appendChild(link);
          doc.body.appendChild(iframe);

          // Add unload warning
          const script = doc.createElement("script");
          script.textContent = `
            window.onbeforeunload = function (event) {
              const confirmationMessage = 'Leave Site?';
              (event || window.event).returnValue = confirmationMessage;
              return confirmationMessage;
            };
          `;
          doc.head.appendChild(script);

          // Close original window and open educational site instead
          window.location.replace(pLink);
        } catch (e) {
          console.error("Error setting up about:blank popup:", e);
        }
      }
    }, 500);
  }
}

/**
 * Get a random educational URL to display when leaving
 * @returns {string} A random educational URL
 */
function getRandomEducationalUrl() {
  const educationalUrls = [
    "https://classroom.google.com",
    "https://drive.google.com",
    "https://docs.google.com",
    "https://www.google.com",
    "https://khanacademy.org",
    "https://www.wikipedia.org",
    "https://www.nasa.gov",
  ];
  return educationalUrls[Math.floor(Math.random() * educationalUrls.length)];
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAboutBlank);
} else {
  initializeAboutBlank();
}
