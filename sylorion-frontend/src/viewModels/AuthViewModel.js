import { apiService } from "../services/apiService";

class AuthViewModel {
  static async login(username, password) {
    try {
      const response = await apiService.post("/login", {
        username,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw new Error("Une erreur s'est produite lors de la connexion.");
    }
  }
}

export default AuthViewModel;
