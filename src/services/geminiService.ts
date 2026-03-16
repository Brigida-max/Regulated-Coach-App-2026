export const generateSpeech = async (text: string) => {
  if (!text) return null;
  console.log("AI Coach aanroep voor:", text);
  
  // Deze simpele functie zorgt dat de rest van je app niet crasht
  return {
    response: {
      text: () => "De AI Coach is bijna klaar met opstarten.",
    }
  };
};