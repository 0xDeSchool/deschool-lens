# cc_booth_stg env set up

### cc_booth_stg security group
resource "aws_security_group" "sg_cc_booth_stg" {
  name        = "security-group-cc_booth_stg"
  description = "security group for cc_booth_stg"
  vpc_id      = aws_vpc.vpc_booth_stg.id

  ingress {
    description = "TLS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "tcp"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description      = "all egress"
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "[terraform] security group cc_booth_stg"
  }
}

### cc_booth_stg vm
resource "aws_instance" "cc_booth_stg" {
  ami           = local.u20lts_ami
  instance_type = local.vm_type_cc_booth_stg

  subnet_id                   = aws_subnet.subnet_booth_stg_a.id
  vpc_security_group_ids      = [aws_security_group.sg_cc_booth_stg.id]
  associate_public_ip_address = true
  key_name                    = "Cleopatra_AWS"


  tags = {
    Name = "[terraform] cc_booth_stg"
  }

  user_data = file("./init.sh")
}
