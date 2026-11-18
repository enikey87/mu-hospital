"""Exercise the real Ansible playbook locally, without sudo or a server."""
import getpass
import grp
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
import unittest


REPO = Path(__file__).resolve().parents[1]


class DeployTest(unittest.TestCase):
    def test_install_repeat_update_failure_and_rollback(self):
        with tempfile.TemporaryDirectory(prefix="mu-hospital-deploy-") as directory:
            work = Path(directory)
            site = work / "site"
            inventory = work / "inventory.ini"
            inventory.write_text("[web]\nlocalhost ansible_connection=local\n")

            def archive(name, files):
                path = work / f"{name}.tar.gz"
                with tarfile.open(path, "w:gz") as output:
                    for filename, content in files.items():
                        data = content.encode()
                        info = tarfile.TarInfo(filename)
                        info.size = len(data)
                        info.mode = 0o644
                        output.addfile(info, io.BytesIO(data))
                return path

            def deploy(path, succeeds=True):
                variables = {
                    "archive_path": str(path), "site_root": str(site),
                    "ansible_become": False,
                    "ansible_python_interpreter": "/usr/bin/python3",
                    "deploy_owner": getpass.getuser(),
                    "deploy_group": grp.getgrgid(os.getgid()).gr_name,
                    "ansible_remote_tmp": str(work / "remote-tmp"),
                }
                result = subprocess.run(
                    ["ansible-playbook", "-i", str(inventory),
                     str(REPO / "deploy/deploy.yml"), "-e", json.dumps(variables)],
                    env={**os.environ, "ANSIBLE_LOCAL_TEMP": str(work / "local-tmp"),
                         "ANSIBLE_NOCOLOR": "1"},
                    capture_output=True, text=True, timeout=120,
                )
                self.assertEqual(result.returncode == 0, succeeds,
                                 result.stdout + result.stderr)
                return result.stdout

            first = archive("first", {"index.html": "first", "assets/first.js": "first"})
            second = archive("second", {"index.html": "second", "assets/second.js": "second"})
            invalid = archive("invalid", {"wrong/index.html": "invalid"})

            deploy(first)
            first_release = site.resolve()
            self.assertTrue(site.is_symlink())
            self.assertEqual((site / "index.html").read_text(), "first")
            self.assertRegex(deploy(first), re.compile(r"changed=0\s"))
            deploy(second)
            self.assertEqual((site / "index.html").read_text(), "second")
            self.assertNotEqual(site.resolve(), first_release)
            self.assertFalse((site / "assets/first.js").exists())
            self.assertEqual((first_release / "index.html").read_text(), "first")
            deploy(invalid, succeeds=False)
            self.assertEqual((site / "index.html").read_text(), "second")
            deploy(first)
            self.assertEqual(site.resolve(), first_release)
            self.assertEqual((site / "index.html").read_text(), "first")

            site.unlink()
            site.mkdir()
            (site / "keep.txt").write_text("existing data")
            deploy(second, succeeds=False)
            self.assertEqual((site / "keep.txt").read_text(), "existing data")


if __name__ == "__main__":
    unittest.main()
