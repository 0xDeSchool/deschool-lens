# booth_prd env set up

### booth_prd vpc

resource "aws_vpc" "vpc_booth_prd" {
  cidr_block           = "172.28.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true

  tags = {
    Name = "[terraform] vpc booth_prd"
  }
}

### booth_prd subnet A
resource "aws_subnet" "subnet_booth_prd_a" {
  vpc_id            = aws_vpc.vpc_booth_prd.id
  cidr_block        = "172.28.16.0/20"
  availability_zone = "us-east-1a"
  tags = {
    Name = "[terraform] subnet booth_prd A"
  }
}

### booth_prd subnet B
resource "aws_subnet" "subnet_booth_prd_b" {
  vpc_id            = aws_vpc.vpc_booth_prd.id
  cidr_block        = "172.28.32.0/20"
  availability_zone = "us-east-1b"
  tags = {
    Name = "[terraform] subnet booth_prd B"
  }
}

### booth_prd gateway
resource "aws_internet_gateway" "ig_booth_prd" {
  vpc_id = aws_vpc.vpc_booth_prd.id
  tags = {
    Name = "[terraform] VPC internet gateway booth_prd"
  }
}

### booth_prd route table
resource "aws_route_table" "public_rt_booth_prd" {
  vpc_id = aws_vpc.vpc_booth_prd.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig_booth_prd.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.ig_booth_prd.id
  }

  tags = {
    Name = "[terraform] public route table booth_prd"
  }
}

### booth_prd route table association
resource "aws_route_table_association" "public_rt_booth_prd" {
  subnet_id      = aws_subnet.subnet_booth_prd_a.id
  route_table_id = aws_route_table.public_rt_booth_prd.id
}

### booth_prd security group
resource "aws_security_group" "sg_booth_prd" {
  name        = "security-group-booth_prd"
  description = "security group for booth_prd"
  vpc_id      = aws_vpc.vpc_booth_prd.id

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
    Name = "[terraform] security group booth_prd"
  }
}

### booth_prd vm
resource "aws_instance" "booth_prd" {
  ami           = local.u20lts_ami
  instance_type = local.vm_type_booth_prd

  subnet_id                   = aws_subnet.subnet_booth_prd_a.id
  vpc_security_group_ids      = [aws_security_group.sg_booth_prd.id]
  associate_public_ip_address = true
  key_name                    = "Cleopatra_AWS"


  tags = {
    Name = "[terraform] booth_prd"
  }

  user_data = file("./init.sh")
}
