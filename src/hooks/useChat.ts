import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc,
  addDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useChat(conversationId?: string) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to conversations
  useEffect(() => {
    if (!user || !user.unionId) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.unionId),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen to messages
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async (receiverUnionId: string, content: string) => {
    if (!user) return;

    const participants = [user.unionId, receiverUnionId].sort();
    const convId = participants.join("_");
    const convRef = doc(db, "conversations", convId);

    // Ensure conversation exists
    await setDoc(convRef, {
      participants,
      lastMessage: content,
      lastMessageAt: serverTimestamp(),
    }, { merge: true });

    // Add message
    await addDoc(collection(convRef, "messages"), {
      senderId: user.unionId,
      content,
      createdAt: serverTimestamp(),
    });

    await updateDoc(convRef, {
      lastMessage: content,
      lastMessageAt: serverTimestamp(),
    });
  };

  return {
    conversations,
    messages,
    loading,
    sendMessage
  };
}
