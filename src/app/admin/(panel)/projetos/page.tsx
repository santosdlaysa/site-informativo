import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { AdminProjectsList } from "@/presentation/components/admin/admin-projects-list";
import { PlusIcon } from "@/presentation/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos — Admin" };

export default async function AdminProjetosPage() {
  const projects = await container.listProjects.execute();

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Projetos</h1>
          <div className="sub">Coleções do tipo galeria que abrem outros posts</div>
        </div>
        <Link className="btn btn-primary" href="/admin/projetos/novo">
          <PlusIcon /> Nova coleção
        </Link>
      </div>

      <AdminProjectsList projects={projects} />
    </>
  );
}
