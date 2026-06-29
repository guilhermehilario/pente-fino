export const mockCompanyData = {
  name: "TechNova Soluções S.A.",
  cnpj: "12.345.678/0001-99",
  marketValue: "R$ 45.200.000,00",
  creationDate: "15 de Março de 2018",
  status: "Ativa",
  email: "contato@technova.com.br",
  phone: "(11) 4002-8922",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
  politicians: [
    { id: 1, name: "Roberto Alves", role: "Deputado Estadual", party: "PMB" },
    { id: 2, name: "João Silveira", role: "Senador", party: "PSD" },
    { id: 3, name: "Maria Costa", role: "Prefeita", party: "MDB" }
  ],
  partners: [
    { id: 1, name: "Carlos Eduardo Mendes", role: "Sócio-Administrador", equity: "45%" },
    { id: 2, name: "Ana Beatriz Silveira", role: "Sócia", equity: "30%" },
    { id: 3, name: "Fernando Costa", role: "Sócio", equity: "25%" }
  ]
};

export const mockPersonData = {
  name: "Roberto Alves",
  role: "Deputado Estadual",
  salary: "R$ 31.238,19",
  wealth: "R$ 4.250.000,00",
  status: "Ativo",
  email: "gab.robertoalves@alesp.sp.gov.br",
  phone: "(11) 3886-0000",
  address: "Palácio 9 de Julho - Av. Pedro Álvares Cabral, 201",
  linkedCompanies: [
    { id: 1, name: "TechNova Soluções S.A.", cnpj: "12.345.678/0001-99", relation: "Sócio Oculto / Suspeita" },
    { id: 2, name: "Construtora Horizonte", cnpj: "98.765.432/0001-10", relation: "Ex-Sócio" },
    { id: 3, name: "AgroPecuária Alves", cnpj: "45.123.789/0001-55", relation: "Sócio-Administrador" }
  ],
  linkedPeople: [
    { id: 1, name: "Maria Costa", role: "Prefeita", relation: "Aliada Política" },
    { id: 2, name: "Carlos Eduardo Mendes", role: "Empresário", relation: "Doador de Campanha" }
  ]
};
