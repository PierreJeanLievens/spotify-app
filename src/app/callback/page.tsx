import { Suspense } from "react";
import CallbackComponent from "./callback-component"; // On déplace la logique dans un composant séparé

export default function CallbackPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <CallbackComponent />
    </Suspense>
  );
}
