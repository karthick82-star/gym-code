// ====== EDIT THIS: WhatsApp number with country code, digits only (e.g. 919876543210) ======
const WHATSAPP_NUMBER = "";
const wa = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// header: solid on scroll & mobile navigation drawer
const header = $("header"), nav = $("nav"), backdrop = $(".nav-backdrop");
const onScroll = () => header.classList.toggle("solid", scrollY > 30);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

const openNav = () => {
  nav?.classList.add("open");
  backdrop?.classList.add("open");
  document.body.classList.add("nav-active");
};

const closeNav = () => {
  nav?.classList.remove("open");
  backdrop?.classList.remove("open");
  document.body.classList.remove("nav-active");
};

$(".menu-btn")?.addEventListener("click", openNav);
$(".nav-close")?.addEventListener("click", closeNav);
backdrop?.addEventListener("click", closeNav);
$$("nav a").forEach(a => a.addEventListener("click", closeNav));
addEventListener("keydown", e => {
  if (e.key === "Escape" && nav?.classList.contains("open")) closeNav();
});

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
$$(".reveal").forEach(el => io.observe(el));

// WhatsApp buttons
$$("[data-wa]").forEach(b => b.addEventListener("click", e => {
  e.preventDefault();
  if (!WHATSAPP_NUMBER) return alert("Add the gym WhatsApp number in js/main.js (WHATSAPP_NUMBER).");
  open(wa(b.dataset.wa || "Hi! I'd like to know more about Mr & Mrs Muscles Fitness Gym."), "_blank");
}));

// timetable: highlight today
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], today = days[new Date().getDay()];
$$(".row[data-day]").forEach(r => { if (r.dataset.day === today) { r.classList.add("is-today"); $(".day", r).insertAdjacentHTML("beforeend", '<span class="today">Today</span>'); } });

// gallery lightbox
const items = $$(".g-item");
if (items.length) {
  const lb = $(".lightbox"), img = $("img", lb), cap = $(".lb-cap", lb); let cur = 0;
  const show = i => { cur = (i + items.length) % items.length; const it = items[cur]; img.src = $("img", it).src; img.alt = $("img", it).alt; cap.textContent = $("strong", it).textContent; lb.classList.add("open"); };
  items.forEach((it, i) => it.addEventListener("click", () => show(i)));
  $(".lb-close").onclick = () => lb.classList.remove("open");
  $(".lb-prev").onclick = () => show(cur - 1); $(".lb-next").onclick = () => show(cur + 1);
  lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("open"); });
  addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") lb.classList.remove("open"); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
}

// contact form: validate, then open WhatsApp / mailto-style fallback
const form = $("#enquiry");
if (form) {
  const pre = new URLSearchParams(location.search);
  if (pre.get("program")) form.program.value = pre.get("program");
  if (pre.get("plan")) form.message.value = `I'm interested in the ${pre.get("plan")} membership.`;
  const msg = () => `Hi! I'm ${form.name.value} (${form.mobile.value}). Interested in: ${form.program.value}. ${form.message.value}`;
  const valid = () => { let ok = true;
    $$(".field", form).forEach(f => { const i = $("input,select,textarea", f); const bad = i.required && !i.value.trim() || i.name === "mobile" && !/^[+\d][\d\s-]{6,}$/.test(i.value.trim()) || i.type === "email" && i.value && !/^\S+@\S+\.\S+$/.test(i.value);
      f.classList.toggle("err", !!bad); if (bad) ok = false; }); return ok; };
  form.addEventListener("submit", e => { e.preventDefault(); if (!valid()) return;
    $(".form-ok").style.display = "block"; $(".form-ok").textContent = "Thank you! Your enquiry is ready — our team will contact you shortly.";
    console.log("Enquiry:", Object.fromEntries(new FormData(form))); form.reset(); });
  $("#wa-form").addEventListener("click", () => { if (!valid()) return; if (!WHATSAPP_NUMBER) return alert("Add the gym WhatsApp number in js/main.js (WHATSAPP_NUMBER)."); open(wa(msg()), "_blank"); });
}
