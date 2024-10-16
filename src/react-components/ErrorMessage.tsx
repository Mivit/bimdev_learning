import * as React from 'react';
import { useParams } from 'react-router-dom';

interface Props { 
  message: string
}

// öppna en dialogruta med ett felmeddelande och gå tillbaka till föregående sida

export function ErrorMessage(props: { message: string }) {
  return (
    <dialog className="error-message">
      <p>{props.message}</p>
    </dialog>
  )
}