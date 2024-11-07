"use client"

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Link from "next/link";

interface IFormInputs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required('Le prénom est requis'),
  lastName: yup.string().required('Le nom de famille est requis'),
  email: yup.string().email('Format d\'email invalide').required('L\'email est requis'),
  password: yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[@$!%*?&#]/, 'Le mot de passe doit contenir au moins un caractère spécial')
    .required('Le mot de passe est requis'),
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    try {
      await toast.promise(
        axios.post("/api/register", data),
        {
          loading: "Enregistrement en cours...",
          success: "Enregistrement réussi !",
          error: (error) => {
            const errorMessage = error.response?.data?.error || "Une erreur s&apos;est produite";
            return `Échec de l&apos;enregistrement : ${errorMessage}`;
          },
        }
      );

      router.push("/login");
    } catch (error) {
      console.log("Erreur d&apos;enregistrement :", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">S&apos;inscrire</h2>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nom de famille
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          S&apos;inscrire
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte? <Link href="/login" className="text-indigo-600 hover:text-indigo-500">Connectez-vous</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;