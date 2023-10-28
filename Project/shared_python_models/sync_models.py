# Written by AI assistant
import os
import shutil


def copy_files(src_dir, dest_dir):
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dest_dir, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, False, None)
        else:
            if not item == os.path.basename(
                __file__
            ):  # Prevent script from copying itself
                shutil.copy2(s, d)


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)

    # Destination directories
    project_api_models_dir = os.path.join(root_dir, "project-api", "models")
    account_api_models_dir = os.path.join(root_dir, "account-api", "models")

    # Create the destination directories if they do not exist
    os.makedirs(project_api_models_dir, exist_ok=True)
    os.makedirs(account_api_models_dir, exist_ok=True)

    # Copy files
    copy_files(current_dir, project_api_models_dir)
    copy_files(current_dir, account_api_models_dir)


if __name__ == "__main__":
    main()
# End of code written by AI assistant
