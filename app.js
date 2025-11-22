// Moonlit Cove Resort - Frontend with Backend API Integration

// Auto-detect environment and set API URL
// For production, replace 'YOUR_BACKEND_URL' with your deployed backend URL (e.g., Render, Railway, Heroku)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost 
  ? "http://localhost:4000/api"
  : "https://sina-noninjurious-oda.ngrok-free.dev/api";

// Room gallery images mapping (not stored in backend)
const roomGalleries = {
  "moon-suite": {
    imageUrl: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/271649/pexels-photo-271649.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  "cove-retreat": {
    imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  "garden-moon": {
    imageUrl: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  "lagoon-premium": {
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  "family-cove": {
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  "skyline-loft": {
    imageUrl: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  "sunset-cabana": {
    imageUrl: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gallery: [
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
};

// Global state
let rooms = [];
let services = [];
let bookings = [];

// ---- UI helpers ----

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

let currentUser = null;
let selectedStay = {
  checkIn: null,
  nights: 2,
  guests: 2,
};
let selectedRoomId = null;
let selectedServiceIds = new Set();
let selectedPaymentMethod = "card"; // "card" or "upi"
let landingScreenActive = true;
let galleryState = { roomId: null, index: 0 };

function getRoomGallery(room) {
  const galleryData = roomGalleries[room.id];
  if (galleryData && Array.isArray(galleryData.gallery) && galleryData.gallery.length > 0) {
    return galleryData.gallery;
  }
  if (galleryData?.imageUrl) {
    return [galleryData.imageUrl];
  }
  return [];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function showToast(message, type = "success") {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.remove("error", "success");
  toast.classList.add(type);
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// ---- API Helpers ----

async function apiRequest(endpoint, options = {}) {
  // Check if backend URL is configured
  if (API_BASE_URL.includes("YOUR_BACKEND_URL")) {
    throw new Error("Backend not configured");
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🌐 API Request:", url);
    
    // Add timeout for better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      console.error("❌ API Error:", error);
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Success");
    return data;
  } catch (error) {
    console.error("❌ API request failed:", error.message);
    // Always throw a simple error that can be caught by loadRooms/loadServices
    if (error.name === 'AbortError') {
      throw new Error("Backend timeout");
    }
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("not configured") || error.message.includes("timeout")) {
      throw new Error("Backend not available");
    }
    throw error;
  }
}

// Fallback demo rooms data (used when backend is unavailable)
const fallbackRooms = [
  { id: "moon-suite", name: "Moon Suite", type: "Suite", capacity: 2, basePrice: 1500, description: "Oceanfront suite with private balcony", tags: ["Ocean View", "Balcony", "King Bed"] },
  { id: "cove-retreat", name: "Cove Retreat", type: "Deluxe", capacity: 2, basePrice: 2000, description: "Spacious room with stunning cove views", tags: ["Cove View", "Spa Access"] },
  { id: "garden-moon", name: "Garden Moon", type: "Standard", capacity: 2, basePrice: 1500, description: "Peaceful garden-facing room", tags: ["Garden View", "Quiet"] },
  { id: "lagoon-premium", name: "Lagoon Premium", type: "Premium", capacity: 3, basePrice: 2500, description: "Premium room with lagoon access", tags: ["Lagoon Access", "Premium"] },
  { id: "family-cove", name: "Family Cove", type: "Family", capacity: 4, basePrice: 3000, description: "Perfect for families with extra space", tags: ["Family Friendly", "Extra Beds"] },
  { id: "skyline-loft", name: "Skyline Loft", type: "Loft", capacity: 2, basePrice: 2200, description: "Modern loft with city skyline views", tags: ["City View", "Modern"] },
  { id: "sunset-cabana", name: "Sunset Cabana", type: "Cabana", capacity: 2, basePrice: 1800, description: "Beachfront cabana for sunset lovers", tags: ["Beachfront", "Sunset View"] },
];

async function loadRooms() {
  try {
    const params = new URLSearchParams();
    if (selectedStay.checkIn) {
      params.append("checkIn", selectedStay.checkIn);
      params.append("nights", selectedStay.nights);
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/rooms?${queryString}` : "/rooms";
    const data = await apiRequest(endpoint);
    
    if (!data || !data.rooms || !Array.isArray(data.rooms)) {
      console.error("Invalid rooms data:", data);
      throw new Error("Invalid response from server");
    }
    
    rooms = data.rooms.map((room) => {
      // Handle tags - can be string (from MySQL GROUP_CONCAT) or array
      let tagsArray = [];
      if (Array.isArray(room.tags)) {
        tagsArray = room.tags;
      } else if (typeof room.tags === "string" && room.tags) {
        tagsArray = room.tags.split("||").filter(Boolean);
      }
      
      return {
        ...room,
        basePrice: room.basePrice || room.base_price || 0,
        tags: tagsArray,
        available: room.available !== false,
        ...roomGalleries[room.id], // Add gallery images
      };
    });
    
    console.log("✅ Rooms loaded from backend:", rooms.length);
    return rooms;
  } catch (error) {
    console.error("Error loading rooms from backend:", error);
    // ALWAYS fallback to demo data to ensure rooms are shown
    console.warn("⚠️ Backend unavailable, using fallback demo data");
    rooms = fallbackRooms.map((room) => ({
      ...room,
      available: true,
      ...roomGalleries[room.id], // Add gallery images
    }));
    
    // Don't show error toast - rooms will still display from fallback data
    // This is normal if backend is temporarily unavailable
    return rooms; // Always return rooms, never empty array
  }
}

// Fallback demo services data
const fallbackServices = [
  { id: "spa-journey", name: "Spa Journey", description: "Full body massage and relaxation", price: 2000 },
  { id: "moonlit-dinner", name: "Moonlit Dinner", description: "Private dinner by the ocean", price: 2500 },
  { id: "breakfast-basket", name: "Breakfast Basket", description: "Gourmet breakfast delivered to your room", price: 1500 },
  { id: "sunset-cruise", name: "Sunset Cruise", description: "Evening boat ride with refreshments", price: 3000 },
];

async function loadServices() {
  try {
    const data = await apiRequest("/services");
    services = data.services || [];
    console.log("✅ Services loaded from backend:", services.length);
    return services;
  } catch (error) {
    // ALWAYS fallback to demo data to ensure services are shown
    console.warn("⚠️ Backend unavailable, using fallback demo services");
    services = fallbackServices;
    return services; // Always return services, never empty array
  }
}

async function loadBookings() {
  if (!currentUser) {
    bookings = [];
    return [];
  }
  try {
    console.log("Loading bookings for user:", currentUser.id);
    const data = await apiRequest(`/bookings?userAuthId=${encodeURIComponent(currentUser.id)}`);
    bookings = data.bookings || [];
    console.log("✅ Bookings loaded:", bookings.length, bookings);
    return bookings;
  } catch (error) {
    console.error("❌ Error loading bookings:", error.message);
    // Don't show error toast - just silently fail and show empty bookings
    // This is normal if backend is not available or user has no bookings
    bookings = [];
    return [];
  }
}

async function createBooking(roomId, fromDate, nights, guests, serviceIds, paymentMethod, paymentRef) {
  if (!currentUser) {
    throw new Error("User not logged in");
  }

  // Check if backend is available
  if (API_BASE_URL.includes("YOUR_BACKEND_URL") || API_BASE_URL.includes("localhost") && !isLocalhost) {
    throw new Error("Backend not connected. Please deploy the backend to enable bookings. See DEPLOYMENT_GUIDE.md for instructions.");
  }

  try {
    const response = await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify({
        roomId,
        userAuthId: currentUser.id,
        userDisplayName: currentUser.displayName,
        fromDate,
        nights,
        guests,
        serviceIds: Array.from(serviceIds),
        paymentMethod,
        paymentRef,
      }),
    });

    return response;
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("Cannot connect")) {
      throw new Error("Cannot connect to backend server. Please make sure the backend is deployed and running. Bookings cannot be saved without a backend connection.");
    }
    throw error;
  }
}

async function cancelBooking(bookingId) {
  if (!currentUser) {
    throw new Error("User not logged in");
  }

  await apiRequest(`/bookings/${bookingId}`, {
    method: "DELETE",
    body: JSON.stringify({
      userAuthId: currentUser.id,
    }),
  });
}

// ---- Login ----

function openLoginModal() {
  qs("#loginModal").classList.add("open");
}

function closeLoginModal() {
  qs("#loginModal").classList.remove("open");
}

function setUser(user) {
  currentUser = user;
  const loginButton = qs("#loginButton");
  if (user) {
    loginButton.textContent = user.displayName || "Account";
    loginButton.classList.remove("primary");
    loginButton.classList.add("ghost");
    showToast(`Welcome, ${user.displayName || "Guest"}!`, "success");
    dismissLandingScreen();
    loadBookings().then(() => renderBookings());
  } else {
    loginButton.textContent = "Login";
    loginButton.classList.remove("ghost");
    loginButton.classList.add("primary");
    const bookingsContainer = qs("#bookingsContainer");
    if (bookingsContainer) bookingsContainer.innerHTML = "";
    bookings = [];
  }
}

function dismissLandingScreen() {
  if (!landingScreenActive) return;
  landingScreenActive = false;
  const landing = qs("#landingScreen");
  if (landing) {
    landing.classList.add("hidden");
  }
}

function initLandingScreen() {
  const btn = qs("#landingBookButton");
  if (!btn) {
    landingScreenActive = false;
    return;
  }
  btn.addEventListener("click", () => {
    dismissLandingScreen();
    openLoginModal();
  });
}

function initLogin() {
  const loginBtn = qs("#loginButton");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (currentUser) {
        setUser(null);
        return;
      }
      openLoginModal();
    });
  }

  const closeBtn = qs("#closeLoginModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLoginModal);
  }

  const phoneLoginBtn = qs("#phoneLoginButton");
  if (phoneLoginBtn) {
    phoneLoginBtn.addEventListener("click", () => {
      const phone = qs("#phoneNumber")?.value.trim() || "";
      const otp = qs("#otpInput")?.value.trim() || "";
      if (!phone || phone.length < 10) {
        showToast("Please enter a valid phone number.", "error");
        return;
      }
      if (!otp || otp !== "123456") {
        showToast("Invalid OTP. Demo OTP is 123456.", "error");
        return;
      }
      setUser({ id: `phone_${phone}`, displayName: `Guest ${phone.slice(-4)}` });
      closeLoginModal();
    });
  }

  const sendOtpBtn = qs("#sendOtpButton");
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
      const phone = qs("#phoneNumber")?.value.trim() || "";
      if (!phone || phone.length < 10) {
        showToast("Please enter a valid phone number.", "error");
        return;
      }
      showToast("OTP sent! (Demo: use 123456)", "success");
    });
  }

  const gmailLoginBtn = qs("#gmailLoginButton");
  if (gmailLoginBtn) {
    gmailLoginBtn.addEventListener("click", () => {
      const email = qs("#gmailInput")?.value.trim() || "";
      if (!email || !email.includes("@")) {
        showToast("Please enter a valid Gmail address.", "error");
        return;
      }
      setUser({ id: `gmail_${email}`, displayName: email.split("@")[0] });
      closeLoginModal();
    });
  }
}

// ---- Rooms & Services Rendering ----

function renderRooms() {
  const container = qs("#roomsContainer");
  if (!container) return;
  
  container.innerHTML = "<p class='helper-text'>Loading rooms...</p>";

  loadRooms().then(() => {
    // Always show rooms - fallback ensures we always have data
    if (rooms.length === 0) {
      // If somehow we have no rooms, use fallback immediately
      console.warn("No rooms found, using fallback");
      rooms = fallbackRooms.map((room) => ({
        ...room,
        available: true,
        ...roomGalleries[room.id],
      }));
    }
    
    container.innerHTML = "";
    rooms.forEach((room) => {
      const available = room.available !== false;
      const perNight = room.basePrice;
      const total = perNight * (selectedStay.nights || 1);

      const card = document.createElement("article");
      card.className = "room-card";
      const gallery = getRoomGallery(room);
      const heroImage =
        gallery[0] ||
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";

      card.innerHTML = `
        <div class="room-image" data-gallery-room="${room.id}">
          <img src="${heroImage}" alt="${room.name}" loading="lazy" />
        </div>
        <div class="room-type">${room.type}</div>
        <div class="room-name">${room.name}</div>
        <p class="room-description">${room.description || ""}</p>
        <div class="room-meta">
          <span>${room.capacity} guests max</span>
          ${(room.tags || []).map((t) => `<span>${t}</span>`).join("")}
        </div>
        <div class="room-footer">
          <div>
            <div class="price-pill">
              <span>From</span>
              <strong>${formatCurrency(perNight)}</strong>
              <span>/night</span>
            </div>
            ${
              selectedStay.checkIn
                ? `<div class="helper-text">Est. total: ${formatCurrency(
                    total
                  )} for ${selectedStay.nights} night${
                    selectedStay.nights > 1 ? "s" : ""
                  }</div>`
                : ""
            }
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
            <span class="badge ${available ? "" : "unavailable"}">
              ${available ? "Available" : "Unavailable"}
            </span>
            <button
              class="btn small ${available ? "accent" : "ghost"}"
              data-room-id="${room.id}"
              ${available ? "" : "disabled"}
            >
              ${available ? "Select" : "Booked"}
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll("button[data-room-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const roomId = btn.getAttribute("data-room-id");
        openBookingDrawer(roomId);
      });
    });

    container.querySelectorAll("[data-gallery-room]").forEach((img) => {
      img.addEventListener("click", () => {
        const roomId = img.getAttribute("data-gallery-room");
        openRoomGallery(roomId);
      });
    });
  });
}

function renderServices() {
  const container = qs("#servicesContainer");
  container.innerHTML = "<p class='helper-text'>Loading services...</p>";

  loadServices().then(() => {
    container.innerHTML = "";
    services.forEach((service) => {
      const card = document.createElement("article");
      card.className = "service-card";
      card.innerHTML = `
        <div class="service-title">${service.name}</div>
        <div class="service-description">${service.description}</div>
        <div class="service-footer">
          <span class="service-price">${formatCurrency(service.price)}</span>
          <span class="chip">
            <span>Optional</span>
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

// ---- Booking Drawer ----

function openBookingDrawer(roomId) {
  if (!currentUser) {
    showToast("Please login first to book a room.", "error");
    openLoginModal();
    return;
  }

  if (!selectedStay.checkIn) {
    showToast("Select check-in date and nights first.", "error");
    document.getElementById("quickBookingForm").scrollIntoView({ behavior: "smooth" });
    return;
  }

  selectedRoomId = roomId;
  selectedServiceIds = new Set();

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    showToast("Room not found.", "error");
    return;
  }

  const drawer = qs("#bookingDrawer");
  const summary = qs("#drawerRoomSummary");
  const stayDetails = qs("#drawerStayDetails");
  const servicesContainer = qs("#drawerServices");

  summary.innerHTML = `
    <strong>${room.name}</strong>
    <span>${room.type} • Up to ${room.capacity} guests</span>
  `;

  const checkInDate = new Date(selectedStay.checkIn);
  const checkoutDate = new Date(checkInDate);
  checkoutDate.setDate(checkoutDate.getDate() + selectedStay.nights);

  stayDetails.innerHTML = `
    <div>
      <div class="drawer-label">Check-in</div>
      <div class="drawer-value">${checkInDate.toDateString()}</div>
    </div>
    <div>
      <div class="drawer-label">Check-out</div>
      <div class="drawer-value">${checkoutDate.toDateString()}</div>
    </div>
    <div>
      <div class="drawer-label">Nights</div>
      <div class="drawer-value">${selectedStay.nights}</div>
    </div>
    <div>
      <div class="drawer-label">Guests</div>
      <div class="drawer-value">${selectedStay.guests}</div>
    </div>
  `;

  servicesContainer.innerHTML = "";
  services.forEach((service) => {
    const row = document.createElement("div");
    row.className = "drawer-service-row";
    row.innerHTML = `
      <label>
        <input type="checkbox" data-service-id="${service.id}" />
        <span>${service.name}</span>
      </label>
      <span class="price-tag">${formatCurrency(service.price)}</span>
    `;
    servicesContainer.appendChild(row);
  });

  servicesContainer
    .querySelectorAll('input[type="checkbox"][data-service-id]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const id = checkbox.getAttribute("data-service-id");
        if (checkbox.checked) {
          selectedServiceIds.add(id);
        } else {
          selectedServiceIds.delete(id);
        }
        updateDrawerTotal();
      });
    });

  updateDrawerTotal();
  drawer.classList.add("open");
}

function closeBookingDrawer() {
  qs("#bookingDrawer").classList.remove("open");
  selectedRoomId = null;
  selectedServiceIds = new Set();
}

function updateDrawerTotal() {
  if (!selectedRoomId) return;
  const room = rooms.find((r) => r.id === selectedRoomId);
  if (!room) return;
  const base = room.basePrice * selectedStay.nights;
  let servicesTotal = 0;
  services.forEach((s) => {
    if (selectedServiceIds.has(s.id)) {
      servicesTotal += s.price;
    }
  });
  const total = base + servicesTotal;
  qs("#drawerTotal").textContent = formatCurrency(total);
}

async function renderBookings() {
  const container = qs("#bookingsContainer");
  if (!container) {
    console.warn("❌ Bookings container not found - element #bookingsContainer missing");
    return;
  }
  
  console.log("🔄 Rendering bookings...");
  container.innerHTML = "<p class='helper-text'>Loading bookings...</p>";

  if (!currentUser) {
    console.log("⚠️ No user logged in");
    container.innerHTML =
      '<p class="helper-text">Login to see and manage your bookings.</p>';
    return;
  }

  console.log("👤 Current user:", currentUser.id);
  await loadBookings();
  console.log("📋 Bookings to render:", bookings.length, bookings);

  container.innerHTML = "";
  if (bookings.length === 0) {
    console.log("ℹ️ No bookings found for user");
    container.innerHTML =
      '<p class="helper-text">You have no bookings yet. Book a room to see it here.</p>';
    return;
  }
  
  console.log("✅ Rendering", bookings.length, "bookings");

  // Index rooms for quick lookup
  const roomById = {};
  rooms.forEach((r) => {
    roomById[r.id] = r;
  });

  bookings
    .slice()
    .sort((a, b) => new Date(a.from_date) - new Date(b.from_date))
    .forEach((booking) => {
      const room = roomById[booking.room_id];
      // Handle date - can be ISO string or date string
      const fromDateStr = booking.from_date.split('T')[0]; // Get just the date part
      const checkInDate = new Date(fromDateStr);
      const checkoutDate = new Date(checkInDate);
      checkoutDate.setDate(checkoutDate.getDate() + booking.nights);

      const servicesList = booking.services || "None";

      const card = document.createElement("div");
      card.className = "booking-card";
      card.innerHTML = `
        <div class="booking-header">
          <div>
            <div class="booking-title">${
              booking.room_name || room?.name || "Room " + booking.room_id
            }</div>
            <div class="helper-text">
              ${checkInDate.toDateString()} → ${checkoutDate.toDateString()}
            </div>
          </div>
        </div>
        <div class="booking-meta">
          <span><strong>Nights:</strong> ${booking.nights}</span>
          <span><strong>Guests:</strong> ${booking.guests || "-"}</span>
          <span><strong>Services:</strong> ${servicesList}</span>
        </div>
        <div class="booking-actions">
          <button class="btn small ghost" data-cancel-id="${booking.id}">
            Cancel booking
          </button>
        </div>
      `;
      container.appendChild(card);
    });

  container
    .querySelectorAll("button[data-cancel-id]")
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-cancel-id");
        try {
          await cancelBooking(id);
          showToast("Booking cancelled.", "success");
          await loadBookings();
          renderBookings();
          renderRooms();
        } catch (error) {
          showToast(error.message || "Failed to cancel booking.", "error");
        }
      });
    });
}

function openRoomGallery(roomId, startIndex = 0) {
  const room = rooms.find((r) => r.id === roomId);
  const gallery = getRoomGallery(room);
  if (!room || gallery.length === 0) return;
  galleryState = {
    roomId,
    index: Math.max(0, Math.min(startIndex, gallery.length - 1)),
  };
  updateGalleryModal();
  qs("#galleryModal").classList.add("open");
}

function closeGalleryModal() {
  qs("#galleryModal").classList.remove("open");
}

function updateGalleryModal() {
  const room = rooms.find((r) => r.id === galleryState.roomId);
  if (!room) return;
  const gallery = getRoomGallery(room);
  if (gallery.length === 0) return;
  const imageEl = qs("#galleryImage");
  const nameEl = qs("#galleryRoomName");
  const thumbsContainer = qs("#galleryThumbnails");

  if (nameEl) nameEl.textContent = room.name;
  if (imageEl) imageEl.src = gallery[galleryState.index];

  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    gallery.forEach((url, idx) => {
      const thumb = document.createElement("button");
      thumb.className = `gallery-thumb ${idx === galleryState.index ? "active" : ""}`;
      thumb.innerHTML = `<img src="${url}" alt="${room.name} photo ${idx + 1}" />`;
      thumb.addEventListener("click", () => {
        galleryState.index = idx;
        updateGalleryModal();
      });
      thumbsContainer.appendChild(thumb);
    });
  }
}

function initGalleryModal() {
  const modal = qs("#galleryModal");
  if (!modal) return;
  
  const closeBtn = qs("#closeGalleryModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeGalleryModal);
  }
  
  const prevBtn = qs("#galleryPrev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const room = rooms.find((r) => r.id === galleryState.roomId);
      if (!room) return;
      const gallery = getRoomGallery(room);
      if (gallery.length === 0) return;
      galleryState.index =
        (galleryState.index - 1 + gallery.length) % gallery.length;
      updateGalleryModal();
    });
  }
  
  const nextBtn = qs("#galleryNext");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const room = rooms.find((r) => r.id === galleryState.roomId);
      if (!room) return;
      const gallery = getRoomGallery(room);
      if (gallery.length === 0) return;
      galleryState.index = (galleryState.index + 1) % gallery.length;
      updateGalleryModal();
    });
  }
}

function initBookingDrawer() {
  const closeDrawerBtn = qs("#closeDrawer");
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeBookingDrawer);
  }
  
  const cardMethodButton = qs("#cardMethodButton");
  const upiMethodButton = qs("#upiMethodButton");
  const cardFields = qs("#cardPaymentFields");
  const upiFields = qs("#upiPaymentFields");

  function setPaymentMethod(method) {
    selectedPaymentMethod = method;
    if (method === "card") {
      if (cardMethodButton) cardMethodButton.classList.add("active");
      if (upiMethodButton) upiMethodButton.classList.remove("active");
      if (cardFields) cardFields.classList.remove("hidden");
      if (upiFields) upiFields.classList.add("hidden");
    } else {
      if (upiMethodButton) upiMethodButton.classList.add("active");
      if (cardMethodButton) cardMethodButton.classList.remove("active");
      if (upiFields) upiFields.classList.remove("hidden");
      if (cardFields) cardFields.classList.add("hidden");
    }
  }

  if (cardMethodButton) {
    cardMethodButton.addEventListener("click", () => setPaymentMethod("card"));
  }
  if (upiMethodButton) {
    upiMethodButton.addEventListener("click", () => setPaymentMethod("upi"));
  }

  const confirmBtn = qs("#confirmBookingButton");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
    if (!currentUser) {
      showToast("Please login first.", "error");
      return;
    }
    if (!selectedRoomId) {
      showToast("Select a room first.", "error");
      return;
    }

    let paymentRef = null;

    if (selectedPaymentMethod === "card") {
      const cardNumber = qs("#cardNumber").value.trim();
      const expiry = qs("#cardExpiry").value.trim();
      const cvv = qs("#cardCvv").value.trim();

      if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 12) {
        showToast("Enter a valid card number (demo).", "error");
        return;
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        showToast("Enter a valid expiry (MM/YY).", "error");
        return;
      }
      if (!cvv || cvv.length < 3) {
        showToast("Enter a valid CVV.", "error");
        return;
      }
      paymentRef = `card_${cardNumber.slice(-4)}`;
    } else if (selectedPaymentMethod === "upi") {
      const upiId = qs("#upiId").value.trim();
      if (!upiId || !upiId.includes("@")) {
        showToast("Enter a valid UPI ID (e.g., yourname@upi).", "error");
        return;
      }
      paymentRef = upiId;
      showToast("UPI request sent (demo).", "success");
    }

    try {
      await createBooking(
        selectedRoomId,
        selectedStay.checkIn,
        selectedStay.nights,
        selectedStay.guests,
        selectedServiceIds,
        selectedPaymentMethod,
        paymentRef
      );
      showToast("Booking confirmed! Your room is reserved for these dates.", "success");
      closeBookingDrawer();
      // Reload bookings and render
      console.log("Reloading bookings after successful booking...");
      await loadBookings();
      console.log("Bookings after reload:", bookings.length);
      renderBookings();
      renderRooms();
      // Scroll to bookings section to show the new booking
      const bookingsSection = document.getElementById("my-bookings");
      if (bookingsSection) {
        setTimeout(() => {
          bookingsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
      } else {
        console.warn("Bookings section not found");
      }
    } catch (error) {
      showToast(error.message || "Failed to create booking. Please try again.", "error");
      renderRooms();
    }
    });
  }
}

// ---- Quick Booking Form ----

function initQuickBookingForm() {
  const form = qs("#quickBookingForm");
  const checkIn = qs("#checkIn");
  const nights = qs("#nights");
  const guests = qs("#guests");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  checkIn.min = todayStr;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkIn.value) {
      showToast("Please choose a check-in date.", "error");
      return;
    }
    const nightsValue = parseInt(nights.value, 10);
    const guestsValue = parseInt(guests.value, 10);
    if (!nightsValue || nightsValue <= 0) {
      showToast("Nights should be at least 1.", "error");
      return;
    }
    selectedStay.checkIn = checkIn.value;
    selectedStay.nights = nightsValue;
    selectedStay.guests = guestsValue || 1;
    renderRooms();
    document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
  });
}

// ---- Init ----

document.addEventListener("DOMContentLoaded", async () => {
  initLandingScreen();
  initLogin();
  initQuickBookingForm();
  initBookingDrawer();
  initGalleryModal();
  await loadRooms();
  await loadServices();
  renderRooms();
  renderServices();
});
