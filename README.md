# HORUS · Consultoria Financeira

CRM da Horus Consultoria Financeira para os assessores. Concentra clientes, produtos com a comissão de cada um, lançamentos, conferência (previsto × recebido), projeção de receita e relatórios.

- **Site:** Firebase Hosting (`https://horus-consultoria.web.app`)
- **Login:** e-mail e senha, com confirmação por e-mail. Só e-mails liberados entram.
- **Dados:** Cloud Firestore em São Paulo, sincronizados em tempo real entre os assessores.
- **Plano:** funciona no plano gratuito do Firebase (Spark).
- **Publicação:** automática a cada alteração na branch `main` (GitHub Actions).

## Como a receita é calculada

| Tipo de produto | Receita escritório | Exemplo |
|---|---|---|
| **Pontual** | valor da operação × % do produto, no mês da operação | R$ 100 mil em CDB a 1% = R$ 1.000 |
| **Recorrente** | saldo × % ao ano ÷ 12, todo mês enquanto o produto estiver ativo | R$ 100 mil em fundo a 0,6% a.a. = R$ 50/mês |

A parte do assessor é a receita escritório × o repasse dele (padrão de 35%, ajustável em **Assessores**).

A **Conferência** compara, mês a mês e produto a produto, a receita calculada com o valor que veio no extrato do escritório.

## Implantação (uma vez só)

1. **Firebase:** no projeto `horus-consultoria`:
   - Em **Segurança › Authentication**, ative **E-mail/senha**.
   - Em **Bancos de dados e armazenamento › Firestore**, crie o banco `(default)` em **modo de produção**, região **southamerica-east1**.
2. **Chave para o GitHub:** no Cloud Shell do projeto (<https://console.cloud.google.com/?cloudshell=true&project=horus-consultoria>), rode:
   ```bash
   P=horus-consultoria; SA=github-deploy@$P.iam.gserviceaccount.com
   gcloud iam service-accounts create github-deploy --display-name="GitHub deploy"
   for R in roles/firebase.admin roles/iam.serviceAccountUser roles/serviceusage.serviceUsageConsumer; do
     gcloud projects add-iam-policy-binding $P --member="serviceAccount:$SA" --role="$R" --condition=None -q > /dev/null
   done
   gcloud iam service-accounts keys create chave.json --iam-account=$SA
   cloudshell download chave.json
   ```
3. **Segredos no GitHub** (Settings › Secrets and variables › Actions):
   - `FIREBASE_SERVICE_ACCOUNT`: o conteúdo de `chave.json`. Depois, apague o arquivo do computador e rode `rm chave.json` no Cloud Shell.
   - `FIREBASE_PROJECT_ID`: `horus-consultoria`.
4. **Publicar:** em **Actions › Publicar no Firebase › Run workflow**.
5. **Primeiro acesso:** Carlos (caduliam325@gmail.com) entra em **Primeiro acesso**, confirma o e-mail e faz login. Isso libera automaticamente o Kauê (kaueom690@gmail.com), que faz o mesmo caminho em seguida.

## Google Agenda (opcional)

1. Ative a **Google Calendar API**: <https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=horus-consultoria>.
2. Em **APIs e serviços › Tela de consentimento OAuth** (Google Auth Platform), crie o app "HORUS", tipo **Externo**, e adicione os e-mails dos assessores como **usuários de teste**.
3. Em **Credenciais › Criar credenciais › ID do cliente OAuth › Aplicativo da Web**, adicione as origens `https://horus-consultoria.web.app` e `https://horus-consultoria.firebaseapp.com`.
4. No HORUS, abra **Agenda › Ligar Google Agenda** e cole o ID do cliente. Depois, cada assessor clica em **Conectar meu Google Agenda**.

## Estrutura

```
index.html                 página do app
src/main.js                escolhe Firebase (publicado) ou demonstração (sem Firebase)
src/config.js              dono do sistema e assessores iniciais
src/store-firebase.js      login, sincronização em tempo real e assessores
src/app/horus.js           telas, cálculos de comissão, conferência e projeção
src/app/store-local.js     modo demonstração com dados de exemplo
firestore.rules            regras de acesso ao banco
.github/workflows/         publicação automática
```

Para rodar no computador: `npm install` e `npm run dev`. Sem configuração do Firebase, abre em modo demonstração.
