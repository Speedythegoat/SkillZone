
const bcrypt = require("bcrypt");
const {
  CreerUtilisateurs,
  RecupererUtilisateurs,
  ModifierUtilisateurs,
  SupprimerUtilisateurs
} = require("../models/UtilisateurModel");

jest.mock("../supabase/client", () => {
  const mock = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn(),
    eq: jest.fn().mockReturnThis()
  };
  return mock;
});

const supabase = require("../supabase/client");

describe("CreerUtilisateurs", () => {
  it("hash le mot de passe et insère l'utilisateur", async () => {
    const user = {
      nom: "Test",
      email: "test@mail.com",
      motdepasse: "azerty123"
    };

    const fakeHashedPassword = await bcrypt.hash(user.motdepasse, 10);

    supabase.select.mockResolvedValueOnce({
      data: [{ ...user, motdepasse: fakeHashedPassword }],
      error: null
    });

    const result = await CreerUtilisateurs(user);

    expect(result).toHaveLength(1);
    expect(result[0].motdepasse).not.toBe(user.motdepasse);
    expect(result[0].motdepasse).toMatch(/^\$2[aby]\$.{56}$/);
  });

  it("renvoie une erreur si supabase échoue", async () => {
    supabase.select.mockResolvedValueOnce({ data: null, error: { message: "Erreur Supabase" } });

    await expect(
      CreerUtilisateurs({ nom: "A", email: "b@mail.com", motdepasse: "123" })
    ).rejects.toThrow("Erreur Supabase");
  });
});

describe("RecupererUtilisateurs", () => {
  it("retourne tous les utilisateurs", async () => {
    const mockUsers = [{ nom: "User1" }, { nom: "User2" }];
    supabase.select.mockResolvedValueOnce({ data: mockUsers, error: null });

    const result = await RecupererUtilisateurs();

    expect(result).toEqual(mockUsers);
  });

  it("renvoie une erreur en cas d'échec", async () => {
    supabase.select.mockResolvedValueOnce({ data: null, error: { message: "Erreur" } });
    await expect(RecupererUtilisateurs()).rejects.toThrow("Erreur");
  });
});

describe("ModifierUtilisateurs", () => {
  it("met à jour les données utilisateur", async () => {
    const updated = { nom: "Modifié" };
    const id = 1;

    supabase.select.mockResolvedValueOnce({ data: [updated], error: null });

    const result = await ModifierUtilisateurs(id, updated);
    expect(result).toEqual([updated]);
  });

  it("renvoie une erreur si update échoue", async () => {
    supabase.select.mockResolvedValueOnce({ data: null, error: { message: "Erreur" } });

    await expect(ModifierUtilisateurs(1, {})).rejects.toThrow("Erreur");
  });
});

describe("SupprimerUtilisateurs", () => {
  it("supprime un utilisateur", async () => {
    supabase.delete.mockReturnValueOnce({ eq: () => Promise.resolve({ error: null }) });

    const result = await SupprimerUtilisateurs(1);
    expect(result).toEqual({ success: true, message: "Utilisateur Supprimmer" });
  });

  it("renvoie une erreur si delete échoue", async () => {
    supabase.delete.mockReturnValueOnce({
      eq: () => Promise.resolve({ error: { message: "Erreur" } })
    });

    await expect(SupprimerUtilisateurs(2)).rejects.toThrow("Erreur");
  });
});
