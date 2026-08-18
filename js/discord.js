/**
 * ==========================================
 * INTEGRACAO COM O DISCORD (WEBHOOK)
 * ==========================================
 */

function enviarParaDiscord(mensagem) {
    // Sua URL original do Webhook
    const webhookURL = "https://discord.com";
  
    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: mensagem })
    })
    .then(response => {
      if (response.ok) {
        console.log("Notificação enviada ao Discord com sucesso!");
      } else {
        console.error("Falha ao enviar notificação para o Discord.");
      }
    })
    .catch(error => {
        console.error("Erro de rede ao conectar com o Discord:", error);
    });
}
