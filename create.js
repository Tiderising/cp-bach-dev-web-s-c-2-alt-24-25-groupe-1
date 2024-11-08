import { PrismaClient } from "@prisma/client";
import { logActivity } from "../../../services/logService";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Assurez-vous que l'utilisateur est authentifié
      // Cette partie dépend de votre système d'authentification
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { keyName, algorithm, keySize, publicKey, encryptedPrivateKey } =
        req.body;

      // Créer la nouvelle clé
      const newKey = await prisma.key.create({
        data: {
          userId: req.user.id,
          keyName,
          algorithm,
          keySize,
          publicKey,
          encryptedPrivateKey,
        },
      });

      // Log l'activité
      await logActivity(
        req.user.id,
        "CREATE_KEY",
        `Key created: ${newKey.id}`,
        newKey.id
      );

      res.status(201).json(newKey);
    } catch (error) {
      console.error("Error creating key:", error);
      res.status(500).json({ error: "Error creating key" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
