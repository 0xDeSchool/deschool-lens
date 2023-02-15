# lens_hackathon env set up

### lens_hackathon vpc

resource "aws_vpc" "vpc_lens_hackathon" {
  cidr_block           = "172.28.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true

  tags = {
    Name = "[terraform] vpc lens_hackathon"
  }
}

### lens_hackathon subnet A
resource "aws_subnet" "subnet_lens_hackathon_a" {
  vpc_id            = aws_vpc.vpc_lens_hackathon.id
  cidr_block        = "172.28.16.0/20"
  availability_zone = "us-east-1a"
  tags = {
    Name = "[terraform] subnet lens_hackathon A"
  }
}

### lens_hackathon subnet B
resource "aws_subnet" "subnet_lens_hackathon_b" {
  vpc_id            = aws_vpc.vpc_lens_hackathon.id
  cidr_block        = "172.28.32.0/20"
  availability_zone = "us-east-1b"
  tags = {
    Name = "[terraform] subnet lens_hackathon B"
  }
}

### lens_hackathon gateway
resource "aws_internet_gateway" "ig_lens_hackathon" {
  vpc_id = aws_vpc.vpc_lens_hackathon.id
  tags = {
    Name = "[terraform] VPC internet gateway lens_hackathon"
  }
}

### lens_hackathon route table
resource "aws_route_table" "public_rt_lens_hackathon" {
  vpc_id = aws_vpc.vpc_lens_hackathon.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig_lens_hackathon.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.ig_lens_hackathon.id
  }

  tags = {
    Name = "[terraform] public route table lens_hackathon"
  }
}

### lens_hackathon route table association
resource "aws_route_table_association" "public_rt_lens_hackathon" {
  subnet_id      = aws_subnet.subnet_lens_hackathon_a.id
  route_table_id = aws_route_table.public_rt_lens_hackathon.id
}

### lens_hackathon security group
resource "aws_security_group" "sg_lens_hackathon" {
  name        = "security-group-lens_hackathon"
  description = "security group for lens_hackathon"
  vpc_id      = aws_vpc.vpc_lens_hackathon.id

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
    from_port = -1
    to_port   = -1
    protocol  = "icmp"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "[terraform] security group lens_hackathon"
  }
}

### lens_hackathon vm
resource "aws_instance" "bankder_lens_hackathon" {
  ami           = local.u20lts_ami
  instance_type = local.vm_type_lens_hackathon

  subnet_id                   = aws_subnet.subnet_lens_hackathon_a.id
  vpc_security_group_ids      = [aws_security_group.sg_lens_hackathon.id]
  associate_public_ip_address = true
  key_name                    = "Cleopatra_AWS"


  tags = {
    Name = "[terraform] banker lens_hackathon"
  }

  user_data = file("./init.sh")
}
