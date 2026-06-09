-- AlterTable: texto completo do projeto (exibido na página /projeto)
ALTER TABLE "SiteSettings" ADD COLUMN     "qsFullText" TEXT;

-- Preenche o registro existente com o texto completo (parágrafos separados por linha em branco).
UPDATE "SiteSettings"
SET "qsFullText" = 'O Centro de Assistência Multiprofissional em Doenças Raras de Boa Vista é uma iniciativa criada para fortalecer o atendimento às pessoas com doenças raras e suas famílias no município. O projeto resulta da parceria entre a ACDG Brasil, a Secretaria Municipal de Saúde de Boa Vista e o Centro de Serviço e Assistência Social Maria Fernandes (CESASMAF), instituições comprometidas com a promoção da saúde, da inclusão social e da garantia de direitos.

As doenças raras representam um importante desafio para a saúde pública, devido à complexidade do diagnóstico, à necessidade de acompanhamento especializado e ao impacto significativo na vida dos pacientes e familiares. Muitas pessoas enfrentam dificuldades para obter diagnóstico precoce, acesso a especialistas e atendimento contínuo e integrado.

Para enfrentar essa realidade, o Centro oferecerá atendimento multiprofissional nas áreas de medicina, enfermagem, serviço social, psicologia, fisioterapia, fonoaudiologia, terapia ocupacional, nutrição, odontologia, neuropsicopedagogia e genética médica, promovendo um cuidado humanizado, qualificado e centrado nas necessidades dos usuários.

Na fase inicial, o serviço atenderá pacientes encaminhados pelas Unidades Básicas de Saúde (UBS), pelo Hospital da Criança Santo Antônio (HCSA), por outros serviços da rede pública e também por demanda espontânea, ampliando o acesso e possibilitando a identificação de novos casos.

Além da assistência direta, o projeto prevê a realização de levantamentos epidemiológicos e sociais, produção de informações para subsidiar políticas públicas, capacitação permanente das equipes e fortalecimento das articulações institucionais necessárias à integração do serviço à Rede de Atenção à Saúde.

Ao final do processo de implantação, espera-se que o Centro esteja plenamente integrado à rede municipal de saúde, contribuindo para a ampliação do acesso ao diagnóstico e ao cuidado especializado, para a melhoria da qualidade de vida das pessoas com doenças raras e para o fortalecimento das políticas públicas voltadas a essa população.

Mais do que um serviço de saúde, o Centro será um espaço de acolhimento, orientação, produção de conhecimento e defesa de direitos, promovendo cuidado integral, inclusão social e dignidade às pessoas com doenças raras e suas famílias.'
WHERE "id" = 'default';
