export interface PoliticianDetail {
  id: number;
  name: string;
  role: string;
  party: string;
  status: string;
  salary: string;
  wealth: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  biography: string;
  alerts: { type: 'red' | 'orange' | 'yellow'; text: string }[];
  politicalCareer: { year: string; position: string; description: string }[];
  legalProcesses: { year: string; type: string; status: string; description: string }[];
  linkedCompanies: { id: number; name: string; cnpj: string; relation: string }[];
  linkedPeople: { id: number; name: string; role: string; relation: string }[];
}

export interface CompanyDetail {
  id: number;
  name: string;
  cnpj: string;
  marketValue: string;
  creationDate: string;
  status: string;
  email: string;
  phone: string;
  address: string;
  sector: string;
  revenue: string;
  employees: string;
  alerts: { type: 'red' | 'orange' | 'yellow'; text: string }[];
  partners: { id: number; name: string; role: string; equity: string }[];
  politicians: { id: number; name: string; role: string; party: string; relation: string }[];
  suspiciousContracts: { year: string; value: string; agency: string; description: string }[];
}

export const mockPoliticians: Record<number, PoliticianDetail> = {
  1: {
    id: 1,
    name: "Roberto Alves",
    role: "Deputado Estadual",
    party: "PMB",
    status: "Ativo",
    salary: "R$ 31.238,19",
    wealth: "R$ 4.250.000,00",
    email: "gab.robertoalves@alesp.sp.gov.br",
    phone: "(11) 3886-0000",
    address: "Palácio 9 de Julho - Av. Pedro Álvares Cabral, 201 - São Paulo, SP",
    birthDate: "12 de Agosto de 1972",
    biography: "Empresário do setor de tecnologia antes de ingressar na política. Eleito deputado estadual em 2018 e reeleito em 2022. Presidente da Comissão de Ciência e Tecnologia da ALESP. Envolvido em controvérsias relacionadas a licitações públicas na área de TI.",
    alerts: [
      { type: 'red', text: 'Sócio oculto em empresa que venceu licitações públicas' },
      { type: 'orange', text: 'Diferença patrimonial não justificada de R$ 1,2 milhão' },
      { type: 'yellow', text: 'Doações de campanha suspeitas via terceiros' }
    ],
    politicalCareer: [
      { year: '2022', position: 'Deputado Estadual (Reeleito)', description: 'Reeleito com 78.432 votos' },
      { year: '2018', position: 'Deputado Estadual', description: 'Eleito com 52.180 votos' },
      { year: '2014', position: 'Chefe de Gabinete', description: 'Secretário de governo municipal' },
      { year: '2010', position: 'Assessor Parlamentar', description: 'Assessoria técnica na Câmara dos Deputados' }
    ],
    legalProcesses: [
      { year: '2025', type: 'Inquérito Policial', status: 'Em andamento', description: 'Suspeita de fraude em licitação de R$ 8,5 milhões na área de TI' },
      { year: '2024', type: 'Ação Civil Pública', status: 'Em andamento', description: 'Enriquecimento ilícito - diferença patrimonial não justificada' },
      { year: '2023', type: 'Representação', status: 'Arquivada', description: 'Denúncia de uso da máquina pública para fins eleitorais' }
    ],
    linkedCompanies: [
      { id: 1, name: 'TechNova Soluções S.A.', cnpj: '12.345.678/0001-99', relation: 'Sócio Oculto / Suspeita' },
      { id: 2, name: 'Construtora Horizonte', cnpj: '98.765.432/0001-10', relation: 'Ex-Sócio (2015-2020)' },
      { id: 3, name: 'AgroPecuária Alves', cnpj: '45.123.789/0001-55', relation: 'Sócio-Administrador' }
    ],
    linkedPeople: [
      { id: 3, name: 'Maria Costa', role: 'Prefeita', relation: 'Aliada Política' },
      { id: 2, name: 'Carlos Eduardo Mendes', role: 'Empresário', relation: 'Doador de Campanha' }
    ]
  },
  2: {
    id: 2,
    name: "João Silveira",
    role: "Senador",
    party: "PSD",
    status: "Ativo",
    salary: "R$ 41.650,00",
    wealth: "R$ 8.700.000,00",
    email: "sen.joaosilveira@senado.leg.br",
    phone: "(61) 3303-0000",
    address: "Senado Federal - Praça dos Três Poderes - Brasília, DF",
    birthDate: "03 de Março de 1965",
    biography: "Advogado e empresário do ramo de construção civil. Senador desde 2014, com forte atuação na bancada ruralista. Relator de comissões parlamentares de inquérito. Investigações apontam possível favorecimento a empresas do setor de infraestrutura.",
    alerts: [
      { type: 'red', text: 'Empresa familiar beneficiada por emendas parlamentares' },
      { type: 'orange', text: 'Recebimento de vantagens indevidas em contratos públicos' },
      { type: 'yellow', text: 'Sócio em offshores não declaradas' }
    ],
    politicalCareer: [
      { year: '2018', position: 'Senador (Reeleito)', description: 'Reeleito com 4,2 milhões de votos' },
      { year: '2014', position: 'Senador', description: 'Eleito com 3,8 milhões de votos' },
      { year: '2010', position: 'Deputado Federal', description: 'Eleito com 210 mil votos' },
      { year: '2006', position: 'Deputado Estadual', description: 'Eleito com 98 mil votos' }
    ],
    legalProcesses: [
      { year: '2025', type: 'Inquérito Civil', status: 'Em andamento', description: 'Enriquecimento ilícito e lavagem de dinheiro' },
      { year: '2024', type: 'Ação Penal', status: 'Suspensa', description: 'Corrupção passiva - aguarda decisão do STF' },
      { year: '2022', type: 'Representação', status: 'Arquivada', description: 'Abuso de poder econômico em campanha' }
    ],
    linkedCompanies: [
      { id: 1, name: 'TechNova Soluções S.A.', cnpj: '12.345.678/0001-99', relation: 'Doador de Campanha' },
      { id: 4, name: 'Construtora Silveira Ltda.', cnpj: '11.222.333/0001-44', relation: 'Sócio majoritário' },
      { id: 5, name: 'AgroNorte S.A.', cnpj: '55.666.777/0001-88', relation: 'Sócio oculto' }
    ],
    linkedPeople: [
      { id: 3, name: 'Maria Costa', role: 'Prefeita', relation: 'Aliada política' },
      { id: 1, name: 'Roberto Alves', role: 'Deputado Estadual', relation: 'Aliado político' }
    ]
  },
  3: {
    id: 3,
    name: "Maria Costa",
    role: "Prefeita",
    party: "MDB",
    status: "Ativo",
    salary: "R$ 25.000,00",
    wealth: "R$ 1.850.000,00",
    email: "gab.prefeita@prefeitura.sp.gov.br",
    phone: "(11) 3000-0000",
    address: "Prefeitura Municipal - Praça da Matriz, 1 - Centro, SP",
    birthDate: "18 de Junho de 1980",
    biography: "Advogada formada pela USP, especialista em direito administrativo. Iniciou carreira política como vereadora. Prefeita eleita em 2020 com 52% dos votos válidos. Gestão marcada por contratos emergenciais suspeitos na área da saúde.",
    alerts: [
      { type: 'orange', text: 'Contratos emergenciais sem licitação durante pandemia' },
      { type: 'yellow', text: 'NomeaÃ§Ã£o de parentes em cargos comissionados' },
      { type: 'yellow', text: 'Superfaturamento em contratos de merenda escolar' }
    ],
    politicalCareer: [
      { year: '2020', position: 'Prefeita', description: 'Eleita com 52% dos votos válidos' },
      { year: '2016', position: 'Vereadora', description: 'Reeleita com 12.450 votos' },
      { year: '2012', position: 'Vereadora', description: 'Eleita com 8.230 votos' },
      { year: '2008', position: 'Assessora Jurídica', description: 'Consultoria na Câmara Municipal' }
    ],
    legalProcesses: [
      { year: '2025', type: 'Inquérito Civil', status: 'Em andamento', description: 'Improbiade administrativa em contratos da saÃºde' },
      { year: '2024', type: 'Ação Civil Pública', status: 'Em andamento', description: 'Nepotismo e violação da Lei de Licitações' }
    ],
    linkedCompanies: [
      { id: 1, name: 'TechNova Soluções S.A.', cnpj: '12.345.678/0001-99', relation: 'Doador de Campanha' },
      { id: 6, name: 'SaúdePrimeira ServiÃ§os Ltda.', cnpj: '77.888.999/0001-11', relation: 'Contrato emergencial suspeito' }
    ],
    linkedPeople: [
      { id: 1, name: 'Roberto Alves', role: 'Deputado Estadual', relation: 'Aliado político' },
      { id: 2, name: 'João Silveira', role: 'Senador', relation: 'Aliado político' }
    ]
  }
};

export const mockCompanies: Record<number, CompanyDetail> = {
  1: {
    id: 1,
    name: "TechNova Soluções S.A.",
    cnpj: "12.345.678/0001-99",
    marketValue: "R$ 45.200.000,00",
    creationDate: "15 de Março de 2018",
    status: "Ativa",
    email: "contato@technova.com.br",
    phone: "(11) 4002-8922",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    sector: "Tecnologia da Informação",
    revenue: "R$ 12.300.000,00",
    employees: "47",
    alerts: [
      { type: 'red', text: 'Suspeita de sócio oculto com agente público' },
      { type: 'orange', text: 'Venceu licitações acima de R$ 1 milhão sem concorrência' },
      { type: 'yellow', text: 'Mudança de endereço fiscal suspeita pós-contrato' }
    ],
    partners: [
      { id: 1, name: 'Carlos Eduardo Mendes', role: 'Sócio-Administrador', equity: '45%' },
      { id: 2, name: 'Ana Beatriz Silveira', role: 'Sócia', equity: '30%' },
      { id: 3, name: 'Fernando Costa', role: 'Sócio', equity: '25%' }
    ],
    politicians: [
      { id: 1, name: 'Roberto Alves', role: 'Deputado Estadual', party: 'PMB', relation: 'Sócio Oculto / Suspeita' },
      { id: 2, name: 'João Silveira', role: 'Senador', party: 'PSD', relation: 'Doador de Campanha' },
      { id: 3, name: 'Maria Costa', role: 'Prefeita', party: 'MDB', relation: 'Doador de Campanha' }
    ],
    suspiciousContracts: [
      { year: '2025', value: 'R$ 3.200.000,00', agency: 'Prefeitura Municipal', description: 'Sistema de gestão pública - dispensa de licitação' },
      { year: '2024', value: 'R$ 5.800.000,00', agency: 'Governo do Estado', description: 'Plataforma de dados educacionais' },
      { year: '2023', value: 'R$ 1.500.000,00', agency: 'Câmara Municipal', description: 'Software de gestão legislativa' },
      { year: '2022', value: 'R$ 850.000,00', agency: 'Prefeitura Municipal', description: 'Sistema de folha de pagamento' }
    ]
  },
  2: {
    id: 2,
    name: "Construtora Horizonte",
    cnpj: "98.765.432/0001-10",
    marketValue: "R$ 22.800.000,00",
    creationDate: "10 de Janeiro de 2005",
    status: "Ativa",
    email: "contato@constructorahorizonte.com.br",
    phone: "(11) 4500-0000",
    address: "Rua XV de Novembro, 500 - Centro, São Paulo - SP",
    sector: "Construção Civil",
    revenue: "R$ 18.500.000,00",
    employees: "120",
    alerts: [
      { type: 'orange', text: 'Contratos superfaturados com órgãos públicos' },
      { type: 'yellow', text: 'Ex-sócio é agente público investigado' }
    ],
    partners: [
      { id: 4, name: 'Antônio Silveira', role: 'Sócio-Administrador', equity: '60%' },
      { id: 5, name: 'Paulo Mendes', role: 'Sócio', equity: '40%' }
    ],
    politicians: [
      { id: 1, name: 'Roberto Alves', role: 'Deputado Estadual', party: 'PMB', relation: 'Ex-Sócio' }
    ],
    suspiciousContracts: [
      { year: '2024', value: 'R$ 12.000.000,00', agency: 'Prefeitura Municipal', description: 'Obra de pavimentação urbana' },
      { year: '2023', value: 'R$ 6.500.000,00', agency: 'Governo do Estado', description: 'Reforma de escola pública' }
    ]
  },
  3: {
    id: 3,
    name: "AgroPecuária Alves",
    cnpj: "45.123.789/0001-55",
    marketValue: "R$ 8.200.000,00",
    creationDate: "20 de Junho de 2010",
    status: "Ativa",
    email: "contato@agroalves.com.br",
    phone: "(14) 3200-0000",
    address: "Fazenda Boa Vista, Zona Rural - Bauru, SP",
    sector: "Agronegócio",
    revenue: "R$ 3.800.000,00",
    employees: "15",
    alerts: [
      { type: 'yellow', text: 'Sócio-administrador acumula cargo público' }
    ],
    partners: [
      { id: 1, name: 'Roberto Alves', role: 'Sócio-Administrador', equity: '55%' },
      { id: 6, name: 'Ana Alves', role: 'Sócia', equity: '45%' }
    ],
    politicians: [
      { id: 1, name: 'Roberto Alves', role: 'Deputado Estadual', party: 'PMB', relation: 'Sócio-Administrador' }
    ],
    suspiciousContracts: [
      { year: '2025', value: 'R$ 450.000,00', agency: 'Prefeitura Municipal', description: 'Fornecimento de merenda escolar' }
    ]
  },
  4: {
    id: 4,
    name: "Construtora Silveira Ltda.",
    cnpj: "11.222.333/0001-44",
    marketValue: "R$ 35.600.000,00",
    creationDate: "05 de Fevereiro de 2000",
    status: "Ativa",
    email: "contato@constructorasilveira.com.br",
    phone: "(61) 3300-0000",
    address: "SHS Quadra 6 - Brasília, DF",
    sector: "Construção Civil",
    revenue: "R$ 42.000.000,00",
    employees: "250",
    alerts: [
      { type: 'red', text: 'Empresa familiar de senador com contratos públicos milionários' },
      { type: 'orange', text: 'Suspeita de superfaturamento em obras do PAC' }
    ],
    partners: [
      { id: 2, name: 'João Silveira', role: 'Sócio majoritário', equity: '70%' },
      { id: 7, name: 'Lúcia Silveira', role: 'Sócia', equity: '30%' }
    ],
    politicians: [
      { id: 2, name: 'João Silveira', role: 'Senador', party: 'PSD', relation: 'Sócio majoritário' }
    ],
    suspiciousContracts: [
      { year: '2025', value: 'R$ 28.000.000,00', agency: 'DNIT', description: 'Construção de ponte em rodovia federal' },
      { year: '2024', value: 'R$ 45.000.000,00', agency: 'Governo Federal', description: 'Obra de infraestrutura em aeroporto' },
      { year: '2023', value: 'R$ 15.000.000,00', agency: 'Governo do Distrito Federal', description: 'Construção de hospital público' }
    ]
  },
  5: {
    id: 5,
    name: "AgroNorte S.A.",
    cnpj: "55.666.777/0001-88",
    marketValue: "R$ 120.000.000,00",
    creationDate: "12 de Setembro de 1998",
    status: "Ativa",
    email: "contato@agronorte.com.br",
    phone: "(63) 3400-0000",
    address: "Rodovia BR-153, Km 80 - Palmas, TO",
    sector: "Agronegócio",
    revenue: "R$ 85.000.000,00",
    employees: "300",
    alerts: [
      { type: 'red', text: 'Senador é sócio oculto não declarado ao TSE' },
      { type: 'orange', text: 'Empresa beneficiada por subsídios fiscais suspeitos' }
    ],
    partners: [
      { id: 8, name: 'Empresa AgroMilk S.A.', role: 'Sócia', equity: '60%' },
      { id: 2, name: 'João Silveira', role: 'Sócio oculto', equity: '40%' }
    ],
    politicians: [
      { id: 2, name: 'João Silveira', role: 'Senador', party: 'PSD', relation: 'Sócio oculto' }
    ],
    suspiciousContracts: [
      { year: '2025', value: 'R$ 8.000.000,00', agency: 'Incra', description: 'Contrato de reforma agrária' }
    ]
  },
  6: {
    id: 6,
    name: "SaúdePrimeira ServiÃ§os Ltda.",
    cnpj: "77.888.999/0001-11",
    marketValue: "R$ 5.800.000,00",
    creationDate: "02 de Abril de 2020",
    status: "Ativa",
    email: "contato@saudeprimeira.com.br",
    phone: "(11) 3500-0000",
    address: "Rua Augusta, 800 - Consolação, São Paulo - SP",
    sector: "Saúde",
    revenue: "R$ 6.200.000,00",
    employees: "22",
    alerts: [
      { type: 'orange', text: 'Contrato emergencial sem licitação durante pandemia' },
      { type: 'yellow', text: 'Empresa constituída logo antes de vencer licitação' }
    ],
    partners: [
      { id: 9, name: 'Dr. Carlos Nogueira', role: 'Sócio-Administrador', equity: '80%' },
      { id: 10, name: 'Rita Nogueira', role: 'Sócia', equity: '20%' }
    ],
    politicians: [
      { id: 3, name: 'Maria Costa', role: 'Prefeita', party: 'MDB', relation: 'Contrato emergencial suspeito' }
    ],
    suspiciousContracts: [
      { year: '2020', value: 'R$ 3.800.000,00', agency: 'Prefeitura Municipal', description: 'Contrato emergencial de serviços hospitalares - COVID-19' }
    ]
  }
};
