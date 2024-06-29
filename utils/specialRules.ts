export function processServicePublicContent(content: string): string {
    const splitPoint = "Qui peut m'aider ?";
    const index = content.indexOf(splitPoint);
    if (index !== -1) {
      return content.slice(0, index).trim();
    }
    return content;
  }
  
  export const specialRules = {
    'www.service-public.fr': processServicePublicContent,
  };