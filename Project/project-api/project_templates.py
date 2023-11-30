from models.project_models import (
    File,
    Directory,
    ProjectData,
    ProjectDataWithFiles,
    ProjectDataDB,
)

from template_files import (
    empty_file_template,
    basic_web_file_template,
    react_file_template_2,
    next_file_template,
    express_file_template,
    vue_file_template,
    svelte_file_template,
)


empty_template = ProjectDataWithFiles(
    project_id=0,
    project_owner=None,
    project_name="New Project",
    project_description="A new project",
    start_command="",
    is_template=True,
    file_structure=Directory(empty_file_template),
)

express_template = ProjectDataWithFiles(
    project_id=1,
    project_owner=None,
    project_name="Express Starter Template",
    project_description="A starter template for Express projects",
    start_command="node main.js",
    is_template=True,
    file_structure=Directory(express_file_template),
)

basic_web_template = ProjectDataWithFiles(
    project_id=2,
    project_owner=None,
    project_name="Basic Web Trio Starter Template",
    project_description="A starter template for basic web projects",
    start_command="node main.js",
    is_template=True,
    file_structure=Directory(basic_web_file_template),
)

react_template = ProjectDataWithFiles(
    project_id=3,
    project_owner=None,
    project_name="React Starter Template",
    project_description="A starter template for React projects",
    start_command="npm start",
    is_template=True,
    file_structure=Directory(react_file_template_2),
)

next_template = ProjectDataWithFiles(
    project_id=4,
    project_owner=None,
    project_name="Next.js Starter Template",
    project_description="A starter template for Next.js projects",
    start_command="npm run dev",
    is_template=True,
    file_structure=Directory(next_file_template),
)

vue_template = ProjectDataWithFiles(
    project_id=5,
    project_owner=None,
    project_name="Vue Starter Template",
    project_description="A starter template for Vue projects",
    start_command="pnpm dev",
    is_template=True,
    file_structure=Directory(vue_file_template),
)

angular_template = ProjectDataWithFiles(
    project_id=6,
    project_owner=None,
    project_name="Angular Starter Template",
    project_description="A starter template for Angular projects",
    start_command="ng serve",
    is_template=True,
    file_structure=Directory(empty_file_template),
)

svelte_template = ProjectDataWithFiles(
    project_id=7,
    project_owner=None,
    project_name="Svelte Starter Template",
    project_description="A starter template for Svelte projects",
    start_command="pnpm run dev -- --open",
    is_template=True,
    file_structure=Directory(svelte_file_template),
)
