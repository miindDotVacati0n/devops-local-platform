resource "null_resource" "kind_cluster" {
  provisioner "local-exec" {
    command = <<EOT
kind create cluster --name devops-local
EOT
  }
}