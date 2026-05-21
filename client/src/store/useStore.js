import { create } from "zustand";

const useStore = create((set, get) => ({
  // Auth state
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: !!localStorage.getItem("token"),

  // Currently selected product
  selectedProduct: null,

  // Color zones — keys match product.colorZones array
  colorZones: {},

  // Text customisation
  textConfig: {
    teamName: "",
    playerNumber: "",
    font: "Arial",
    fontSize: 48,
    color: "#ffffff",
    placement: "chest",
  },

  // Logo
  logoUrl: "",
  logoPlacement: "chest",

  // Pattern overlay
  patternId: "none",

  // Saved design name
  designName: "Untitled Design",

  // ── Actions ──────────────────────────────────────────────────────────────

  setSelectedProduct: (product) =>
    set({
      selectedProduct: product,
      // Reset colour zones to defaults when product changes
      colorZones: product
        ? Object.fromEntries(
            (product.colorZones || []).map((zone) => [zone, "#ffffff"]),
          )
        : {},
    }),

  setColorZone: (zone, color) =>
    set((state) => ({
      colorZones: { ...state.colorZones, [zone]: color },
    })),

  setTextConfig: (partial) =>
    set((state) => ({
      textConfig: { ...state.textConfig, ...partial },
    })),

  setLogoUrl: (url) => set({ logoUrl: url }),
  setLogoPlacement: (placement) => set({ logoPlacement: placement }),

  setPatternId: (id) => set({ patternId: id }),

  setDesignName: (name) => set({ designName: name }),

  getSnapshot: () => {
    const {
      selectedProduct,
      colorZones,
      textConfig,
      logoUrl,
      logoPlacement,
      patternId,
      designName,
    } = get();
    return {
      selectedProduct,
      colorZones,
      textConfig,
      logoUrl,
      logoPlacement,
      patternId,
      designName,
    };
  },

  // Auth actions
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isLoggedIn: false });
  },

  // Load a complete design snapshot
  loadDesignSnapshot: (snapshot) => {
    set((state) => ({
      ...state,
      selectedProduct: snapshot.selectedProduct || state.selectedProduct,
      colorZones: snapshot.colorZones || state.colorZones,
      textConfig: snapshot.textConfig || state.textConfig,
      logoUrl: snapshot.logoUrl || state.logoUrl,
      logoPlacement: snapshot.logoPlacement || state.logoPlacement,
      patternId: snapshot.patternId || state.patternId,
      designName: snapshot.name || snapshot.designName || state.designName,
    }));
    // Persist as the active design in localStorage
    localStorage.setItem("savedDesign", JSON.stringify(snapshot));
  },
}));

export default useStore;
