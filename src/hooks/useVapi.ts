import { useRef, useState, useEffect } from "react";
// Import the real Vapi SDK
import Vapi from "@vapi-ai/web";

export const useVapi = ({
  publicKey,
  assistant,
}: {
  publicKey: string;
  assistant: string;
}) => {
  const vapiRef = useRef<Vapi | null>(null); // Correctly type the ref
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null); // You might want to use a more specific type if available

  // Use a state for the Vapi instance to ensure it's re-rendered when ready
  const [vapi, setVapi] = useState<Vapi | null>(null);

  // Initialize the Vapi instance on component mount
  useEffect(() => {
    if (publicKey) {
      const vapiInstance = new Vapi(publicKey);
      setVapi(vapiInstance);
      // Clean up the instance on unmount
      return () => {
        vapiInstance.stop(); // Use the correct stop method for cleanup
      };
    }
  }, [publicKey]);

  const start = async () => {
    try {
      if (!vapi) {
        console.error("Vapi is not initialized yet.");
        return;
      }
      
      const call = await vapi.start(assistant); // The correct method signature
      setActiveCall(call);
      setIsCallActive(true);
    } catch (err) {
      console.error("Error starting Vapi call:", err);
    }
  };

  const stop = () => {
    if (vapi) {
      vapi.stop(); // The correct method for stopping the call
      setActiveCall(null);
      setIsCallActive(false);
    }
  };

  // The Vapi SDK provides methods for adding and removing listeners.
  // We can simplify this hook to handle call state based on those events.
  useEffect(() => {
    if (vapi) {
      vapi.on("call-start", () => setIsCallActive(true));
      vapi.on("call-end", () => setIsCallActive(false));
      vapi.on("message", (message) => {
        // You can handle messages directly here if you prefer
        // or let the Chatbot component handle it via `activeCall`
        console.log("New message:", message);
      });
      // Cleanup listeners on unmount
      return () => {
        vapi.removeAllListeners();
      };
    }
  }, [vapi]);

  return { start, stop, isCallActive, activeCall: vapi };
};