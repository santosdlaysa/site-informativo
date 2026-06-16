import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dates = [
  // JANEIRO
  { day: 4,  month: 1,  title: "Dia Mundial do Braille",                                            color: "blue" },
  // FEVEREIRO
  { day: 9,  month: 2,  title: "Dia Internacional da Epilepsia",                                    color: "purple" },
  // MARÇO
  { day: 6,  month: 3,  title: "Dia Mundial do Linfedema",                                          color: "turquoise" },
  { day: 12, month: 3,  title: "Dia Mundial do Rim",                                                 color: "red" },
  { day: 13, month: 3,  title: "Dia Nacional da Endometriose",                                       color: "purple" },
  { day: 21, month: 3,  title: "Dia Internacional da Cefaleia em Salvas",                            color: "orange" },
  { day: 30, month: 3,  title: "Dia Mundial do Transtorno Bipolar",                                  color: "blue" },
  // ABRIL
  { day: 2,  month: 4,  title: "Dia Mundial do Autismo",                                             color: "blue" },
  { day: 17, month: 4,  title: "Dia Mundial da Hemofilia & Von Willebrand",                          color: "red" },
  { day: 23, month: 4,  title: "Dia Internacional da Fibrodisplasia Ossificante Progressiva",        color: "orange" },
  { day: 25, month: 4,  title: "Dia Nacional da Cistinose",                                          color: "green" },
  // MAIO
  { day: 1,  month: 5,  title: "Dia Mundial da Anemia de Fanconi",                                   color: "red" },
  { day: 5,  month: 5,  title: "Dia Internacional da Síndrome de Cri du Chat",                       color: "purple" },
  { day: 6,  month: 5,  title: "Dia Internacional da Síndrome de Moyamoya",                          color: "purple" },
  { day: 7,  month: 5,  title: "Dia Mundial da Asma",                                                color: "turquoise" },
  { day: 7,  month: 5,  title: "Dia Mundial da Espondilite Anquilosante",                            color: "orange" },
  { day: 7,  month: 5,  title: "Dia Estadual da Adrenoleucodistrofia",                               color: "green" },
  { day: 8,  month: 5,  title: "Dia Nacional das Hemoglobinopatias",                                  color: "red" },
  { day: 8,  month: 5,  title: "Dia Mundial da Talassemia",                                           color: "red" },
  { day: 12, month: 5,  title: "Dia Internacional da Enfermagem",                                     color: "turquoise" },
  { day: 12, month: 5,  title: "Dia Mundial da Fibromialgia",                                         color: "orange" },
  { day: 15, month: 5,  title: "Dia Mundial do Hemangioma",                                           color: "red" },
  { day: 15, month: 5,  title: "Dia Mundial das Mucopolissacaridoses",                                color: "purple" },
  { day: 15, month: 5,  title: "Dia Mundial da Esclerose Tuberosa",                                   color: "purple" },
  { day: 15, month: 5,  title: "Dia Internacional da Síndrome de Ehlers-Danlos",                     color: "orange" },
  { day: 17, month: 5,  title: "Dia Mundial da Neurofibromatose",                                     color: "blue" },
  { day: 18, month: 5,  title: "Dia Internacional das Porfirias",                                     color: "green" },
  { day: 25, month: 5,  title: "Dia Internacional da Tireoide",                                       color: "turquoise" },
  { day: 28, month: 5,  title: "Dia Internacional da Síndrome de Treacher Collins",                  color: "purple" },
  // JUNHO
  { day: 1,  month: 6,  title: "Dia Mundial do Hipoparatireoidismo",                                  color: "green" },
  { day: 2,  month: 6,  title: "Dia Mundial das Miastenias",                                          color: "orange" },
  { day: 6,  month: 6,  title: "Dia Nacional do Teste do Pezinho",                                    color: "turquoise" },
  { day: 6,  month: 6,  title: "Dia Mundial do Transplantado",                                        color: "green" },
  { day: 6,  month: 6,  title: "Dia da Hidradenite Supurativa",                                       color: "orange" },
  { day: 9,  month: 6,  title: "Dia da Mielite Transversa",                                           color: "purple" },
  { day: 13, month: 6,  title: "Dia Internacional do Albinismo",                                      color: "blue" },
  { day: 14, month: 6,  title: "Dia Mundial do Doador de Sangue",                                     color: "red" },
  { day: 16, month: 6,  title: "Dia Nacional das Paramiloidoses",                                     color: "purple" },
  { day: 23, month: 6,  title: "Dia da Hipofosfatemia Ligada ao X",                                  color: "green" },
  { day: 27, month: 6,  title: "Dia Internacional da Escoliose",                                      color: "orange" },
  { day: 29, month: 6,  title: "Dia Internacional da Esclerodermia",                                  color: "blue" },
  { day: 30, month: 6,  title: "Dia da Artrogripose",                                                 color: "orange" },
  // JULHO
  { day: 3,  month: 7,  title: "Dia Mundial da Síndrome de Rubinstein-Taybi",                        color: "purple" },
  { day: 8,  month: 7,  title: "Dia Mundial da Alergia",                                              color: "turquoise" },
  { day: 28, month: 7,  title: "Dia Mundial das Hepatites",                                           color: "green" },
  // AGOSTO
  { day: 8,  month: 8,  title: "Dia Nacional do Combate ao Colesterol",                               color: "red" },
  { day: 8,  month: 8,  title: "Dia Nacional da Atrofia Muscular Espinhal",                           color: "orange" },
  { day: 31, month: 8,  title: "Dia do Nutricionista",                                                color: "green" },
  // SETEMBRO
  { day: 7,  month: 9,  title: "Dia Internacional da Distrofia Muscular de Duchenne",                 color: "blue" },
  { day: 8,  month: 9,  title: "Dia Nacional de Luta por Medicamento",                                color: "purple" },
  { day: 13, month: 9,  title: "Dia Mundial da Sepse",                                                color: "red" },
  { day: 20, month: 9,  title: "Dia da Mielofibrose",                                                 color: "orange" },
  { day: 21, month: 9,  title: "Dia Mundial das Miosites",                                            color: "orange" },
  { day: 22, month: 9,  title: "Dia Mundial da Narcolepsia",                                          color: "blue" },
  { day: 24, month: 9,  title: "Dia da Hipercolesterolemia Familiar",                                 color: "red" },
  { day: 25, month: 9,  title: "Dia Internacional das Ataxias",                                       color: "purple" },
  { day: 28, month: 9,  title: "Dia Internacional da Síndrome de Arnold-Chiari",                     color: "purple" },
  // OUTUBRO
  { day: 6,  month: 10, title: "Dia Mundial da Paralisia Cerebral",                                   color: "blue" },
  { day: 9,  month: 10, title: "Dia Mundial da Síndrome de Nicolaides-Baraitser",                    color: "purple" },
  { day: 10, month: 10, title: "Dia Mundial dos Cuidados Paliativos",                                 color: "turquoise" },
  { day: 12, month: 10, title: "Dia Mundial da Artrite",                                              color: "orange" },
  { day: 13, month: 10, title: "Dia Nacional do Fisioterapeuta e Terapeuta Ocupacional",              color: "green" },
  { day: 13, month: 10, title: "Dia Mundial da Trombose",                                             color: "red" },
  { day: 17, month: 10, title: "Dia Internacional da Luta Contra a Dor",                              color: "orange" },
  { day: 20, month: 10, title: "Dia Mundial da Osteoporose",                                          color: "blue" },
  { day: 25, month: 10, title: "Dia Mundial da Mielomeningocele",                                     color: "purple" },
  { day: 25, month: 10, title: "Dia Internacional da Pessoa com Nanismo",                             color: "turquoise" },
  { day: 25, month: 10, title: "Dia do Dentista",                                                     color: "green" },
  { day: 29, month: 10, title: "Dia Mundial do AVC",                                                  color: "red" },
  // NOVEMBRO
  { day: 1,  month: 11, title: "Dia Internacional da Acromegalia",                                    color: "purple" },
  { day: 10, month: 11, title: "Dia Mundial do Ceratocone",                                           color: "turquoise" },
  { day: 14, month: 11, title: "Dia Mundial do Diabetes",                                             color: "blue" },
  { day: 16, month: 11, title: "Dia Nacional dos Ostomizados",                                        color: "green" },
  // DEZEMBRO
  { day: 1,  month: 12, title: "Dia Mundial da AIDS",                                                 color: "red" },
  { day: 5,  month: 12, title: "Dia Nacional da Acessibilidade",                                      color: "blue" },
];

async function main() {
  console.log(`Inserindo ${dates.length} datas comemorativas...`);

  for (const d of dates) {
    const date = new Date(2026, d.month - 1, d.day, 12, 0, 0);
    await prisma.calendarDate.create({
      data: {
        title: d.title,
        date,
        color: d.color,
      },
    });
  }

  console.log("Concluído!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
