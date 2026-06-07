# 🛰️ AstroVision — Classificação Inteligente de Eventos Climáticos

> Plataforma de monitoramento automatizado de eventos climáticos extremos via imagens satelitais e redes neurais convolucionais.

**Global Solution – DevOps 2026 | 4ESPX**

---

## 👥 Grupo

| Nome | RM |
|---|---|
| Vinícius Almeida Bernardino de Souza | RM 97888 |
| João Pedro Borsato Cruz | RM 550294 |
| Maria Fernanda Vieira de Camargo | RM 97956 |
| Pedro Lucas de Andrade Nunes | RM 550366 |
| Fernanda Kaory Saito | RM 551104 |

---

## 📌 Sobre o Projeto

O **AstroVision** é uma plataforma voltada ao monitoramento e classificação automatizada de eventos climáticos extremos a partir de imagens satelitais. Desenvolvido com foco em aplicabilidade real e interpretabilidade científica, o sistema identifica quatro categorias críticas:

- 🌊 Enchentes
- 🌀 Furacões
- ⛈️ Tempestades
- 🔥 Queimadas

### Problema

O monitoramento tradicional enfrenta três limitações críticas:

1. **Velocidade insuficiente** — A análise manual de imagens satelitais demanda horas ou dias, enquanto desastres se alastram em minutos.
2. **Escala operacional limitada** — O volume crescente de dados gerados por satélites supera a capacidade de análise humana.
3. **Ausência de interpretabilidade** — Modelos de IA existentes operam como caixas-pretas, limitando sua adoção institucional.

### ODS Relacionada

🌍 **ODS 13 — Ação Climática**

Contribui diretamente para as metas 13.1 (resiliência a riscos climáticos) e 13.3 (educação e conscientização sobre mudanças climáticas).

---

## 🌐 Aplicação em Produção

```
https://astrovision-c5b4cnapgzdhgxgh.brazilsouth-01.azurewebsites.net/
```

---

## 🏗️ Arquitetura Azure

```
Azure Subscription (Azure for Students)
└── Resource Group: astrovision
    ├── App Service: AstroVision
    │   └── Plan: ASP-AstroVision (Brazil South)
    ├── Key Vault: kv-astrovision
    │   └── Secret: publish-profile
    └── Application Insights: astrovision-insights
        └── Alert Rule: astrovision-alerta
```

---

## 🚀 Stack Tecnológico

| Tecnologia | Papel |
|---|---|
| TensorFlow / Keras | Construção e treinamento da CNN do zero |
| Dataset Satelital | Imagens multiespectrais de eventos climáticos |
| SHAP | Interpretabilidade do modelo (XAI) |
| Apache Airflow | Orquestração do pipeline de dados |
| Streamlit | Interface de demonstração |
| Azure App Service | Hospedagem PaaS da landing page |
| GitHub Actions | Pipeline CI/CD automatizado |
| Azure Key Vault | Armazenamento seguro de credenciais |
| Application Insights | Monitoramento e telemetria em produção |

---

## ⚙️ Pipeline CI/CD

O pipeline é orquestrado via **GitHub Actions** com dois jobs distintos:

```
push → main
    │
    ▼
┌─────────────┐      ┌──────────────┐
│   validar   │ ───► │    deploy    │
│             │      │              │
│ • Arquivos  │      │ • npm install│
│ • Segredos  │      │ • Azure deploy│
│ • Tamanhos  │      └──────────────┘
└─────────────┘
```

### Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy AstroVision

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  validar:
    name: Validar Projeto
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Verificar arquivos obrigatórios
        run: |
          test -f index.html && echo "✅ index.html OK" || exit 1
          test -f style.css  && echo "✅ style.css OK"  || exit 1
          test -f main.js    && echo "✅ main.js OK"    || exit 1
          test -f server.js  && echo "✅ server.js OK"  || exit 1

      - name: Verificar segredos expostos no código
        run: |
          if grep -rEi "password\s*=\s*['\"].{4,}" --include="*.js" --include="*.html" .; then
            echo "❌ Credencial exposta!" && exit 1
          fi
          echo "✅ Nenhuma credencial exposta"

      - name: Tamanho dos arquivos
        run: du -sh index.html style.css main.js server.js

  deploy:
    name: Deploy Azure
    runs-on: ubuntu-latest
    needs: validar
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Instalar dependências
        run: npm install

      - name: Deploy para Azure App Service
        uses: azure/webapps-deploy@v3
        with:
          app-name: AstroVision
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

---

## 🔐 Segurança (DevSecOps)

### Práticas aplicadas

- ✅ **Nenhuma credencial exposta** no código ou histórico do repositório
- ✅ **GitHub Secrets** — publish profile armazenado como secret (`AZURE_WEBAPP_PUBLISH_PROFILE`)
- ✅ **Azure Key Vault** (`kv-astrovision`) — credenciais armazenadas no cofre
  - Secret: `publish-profile` com status **Habilitado**
- ✅ **HTTPS ativo** — certificado SSL provido automaticamente pelo Azure App Service
- ✅ **RBAC configurado** — Role Assignment com `Responsável pelos Segredos do Cofre de Chaves` atribuído à conta de serviço
- ✅ **Verificação de segredos expostos** no pipeline antes de qualquer deploy

### IAM / Role Assignments

| Função | Escopo | Finalidade |
|---|---|---|
| Responsável pelos Segredos do Cofre de Chaves | kv-astrovision | Criar e gerenciar secrets |
| Key Vault Data Access Administrator | kv-astrovision | Gerenciar acesso ao cofre |
| Proprietário | Assinatura (herdado) | Acesso geral à subscription |

---

## 📊 Monitoramento

### Application Insights

- **Recurso:** `astrovision-insights` — Brazil South
- **Chave de instrumentação:** configurada como variável de ambiente no App Service
- **Métricas monitoradas:**
  - Solicitações com falha
  - Tempo de resposta do servidor
  - Solicitações por minuto
  - Disponibilidade

### Alert Rules

| Nome | Condição | Severidade | Ação |
|---|---|---|---|
| `astrovision-alerta` | Requests > 5 em janela de 5min | Crítico (Sev 1) | SMS via grupo `astrovision-alerts` |
| `AValert-request3` | Requests > 10 em janela | Detalhado (Sev 4) | Monitoramento |

> O alerta `astrovision-alerta` foi acionado e resolvido em produção, com notificação via SMS confirmada (`AVAlert:Resolved:Sev3 Azure Monitor Alert astrovision-alerta on astrovision`).

---

## 📁 Estrutura do Repositório

```
AstroVision/
├── index.html              # Landing page principal
├── style.css               # Estilos (tema espacial dark)
├── main.js                 # Scripts (estrelas, cursor, animações)
├── server.js               # Servidor Node.js para App Service
├── package.json            # Dependências do projeto
├── .gitignore              # Arquivos ignorados (publish profile, node_modules)
└── .github/
    └── workflows/
        └── deploy.yml      # Pipeline CI/CD GitHub Actions
```

---

## 🖥️ Como Executar Localmente

```bash
# Clonar o repositório
git clone https://github.com/<seu-usuario>/astrovision.git
cd astrovision

# Instalar dependências
npm install

# Iniciar o servidor
npm start

# Acessar em http://localhost:8080
```

---

## 📋 Checklist de Entrega

| Requisito | Status |
|---|---|
| Resource Group organizado | ✅ `astrovision` — Brazil South |
| App Service criado e configurado | ✅ `AstroVision` com Node 20 LTS |
| Site no ar com HTTPS | ✅ azurewebsites.net com SSL ativo |
| Pipeline GitHub Actions funcionando | ✅ Jobs `validar` + `deploy` |
| Trigger correto (push → main) | ✅ + `workflow_dispatch` |
| Secrets sem exposição no código | ✅ Verificado no pipeline |
| 2+ deploys automáticos no Deployment Center | ✅ 3 deploys registrados |
| Azure Key Vault com credenciais | ✅ Secret `publish-profile` habilitado |
| IAM / Role Assignment documentado | ✅ 3 funções atribuídas |
| Application Insights ativo | ✅ Telemetria em tempo real |
| Alert Rule configurada | ✅ 2 regras ativas com SMS |
| Evidência de alerta disparado | ✅ SMS recebido em produção |
| Logs de container disponíveis | ✅ Fluxo de log no portal Azure |
