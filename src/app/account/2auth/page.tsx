"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { twoFactorCode } from "@/lib/sendTwoFactor";

const ActivationPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ code: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Utilisation du paramètre "code" dans l'URL pour remplir le champ par défaut
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setValue("code", codeFromUrl); // Préremplir le champ "code" si le paramètre existe
    }
  }, [searchParams, setValue]);

  const onSubmit: SubmitHandler<{ code: string }> = async data => {
    try {
      await toast.promise(
        axios.post("/api/activate", data),
        {
          loading: "Vérification en cours...",
          success: "Compte activé avec succès !",
          error: "Échec de l'activation : Code invalide ou expiré.",
        }
      );
      router.push("/login");
    } catch (error) {
      console.log("Erreur d'activation :", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Activation du compte</h2>
        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code d'activation
          </label>
          <input
            type="text"
            id="code"
            {...register("code", { 
              required: "Le code est requis", 
              minLength: { value: 8, message: "Le code doit comporter 8 chiffres" }, 
              maxLength: { value: 8, message: "Le code doit comporter 8 chiffres" }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Activer
        </button>
        <button
        type="button" // Change to "button" to prevent form submission
        className="w-full text-gray-600 hover:text-gray-800 mt-4"
        onClick={() => twoFactorCode()}
        >
            Renvoyer le code
        </button>
        <button
          type="button" // Change to "button" to prevent form submission
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 my-4"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
};

export default ActivationPage;
