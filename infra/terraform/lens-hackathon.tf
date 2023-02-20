# booth_stg env set up

### booth_stg vpc

resource "aws_vpc" "vpc_booth_stg" {
  cidr_block           = "172.28.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true

  tags = {
    Name = "[terraform] vpc booth_stg"
  }
}

### booth_stg subnet A
resource "aws_subnet" "subnet_booth_stg_a" {
  vpc_id            = aws_vpc.vpc_booth_stg.id
  cidr_block        = "172.28.16.0/20"
  availability_zone = "us-east-1a"
  tags = {
    Name = "[terraform] subnet booth_stg A"
  }
}

### booth_stg subnet B
resource "aws_subnet" "subnet_booth_stg_b" {
  vpc_id            = aws_vpc.vpc_booth_stg.id
  cidr_block        = "172.28.32.0/20"
  availability_zone = "us-east-1b"
  tags = {
    Name = "[terraform] subnet booth_stg B"
  }
}

### booth_stg gateway
resource "aws_internet_gateway" "ig_booth_stg" {
  vpc_id = aws_vpc.vpc_booth_stg.id
  tags = {
    Name = "[terraform] VPC internet gateway booth_stg"
  }
}

### booth_stg route table
resource "aws_route_table" "public_rt_booth_stg" {
  vpc_id = aws_vpc.vpc_booth_stg.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig_booth_stg.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.ig_booth_stg.id
  }

  tags = {
    Name = "[terraform] public route table booth_stg"
  }
}

### booth_stg route table association
resource "aws_route_table_association" "public_rt_booth_stg" {
  subnet_id      = aws_subnet.subnet_booth_stg_a.id
  route_table_id = aws_route_table.public_rt_booth_stg.id
}

### booth_stg security group
resource "aws_security_group" "sg_booth_stg" {
  name        = "security-group-booth_stg"
  description = "security group for booth_stg"
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
    Name = "[terraform] security group booth_stg"
  }
}

### booth_stg vm
resource "aws_instance" "booth_stg" {
  ami           = local.u20lts_ami
  instance_type = local.vm_type_booth_stg

  subnet_id                   = aws_subnet.subnet_booth_stg_a.id
  vpc_security_group_ids      = [aws_security_group.sg_booth_stg.id]
  associate_public_ip_address = true
  key_name                    = "Cleopatra_AWS"


  tags = {
    Name = "[terraform] booth_stg"
  }

  user_data = file("./init.sh")
}
