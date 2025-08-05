export const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "Choisir date et heure";
    
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric", 
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
  };