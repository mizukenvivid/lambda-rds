import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from '@cdktf/provider-aws/lib/provider'
import { Vpc } from "@cdktf/provider-aws/lib/vpc";
import { Subnet } from "@cdktf/provider-aws/lib/subnet";
import { DbSubnetGroup } from "@cdktf/provider-aws/lib/db-subnet-group";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here
    new AwsProvider(this, 'aws', {
      region: 'ap-northeast-1'
    })

    const vpc = new Vpc(this, 'vpc', {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: 'cdktf-lambda-rds'
      }
    })

    new Subnet(this, 'subnet-1a-public', {
      vpcId: vpc.id,
      cidrBlock: '10.0.0.0/20',
      availabilityZone: 'ap-northeast-1a',
      tags: {
        Name: 'cdktf-lambda-rds'
      }
    })

    new Subnet(this, 'subnet-1c-public', {
      vpcId: vpc.id,
      cidrBlock: '10.0.16.0/20',
      availabilityZone: 'ap-northeast-1c',
      tags: {
        Name: 'cdktf-lambda-rds'
      }
    })

    const subnet1APrivate = new Subnet(this, 'subnet-1a-private', {
      vpcId: vpc.id,
      cidrBlock: '10.0.128.0/20',
      availabilityZone: 'ap-northeast-1a',
      tags: {
        Name: 'cdktf-lambda-rds'
      }
    })

    const subnet1CPrivate = new Subnet(this, 'subnet-1c-private', {
      vpcId: vpc.id,
      cidrBlock: '10.0.144.0/20',
      availabilityZone: 'ap-northeast-1c',
      tags: {
        Name: 'cdktf-lambda-rds'
      }
    })

    new DbSubnetGroup(this, 'db-subnet-group', {
      name: 'cdktf-lambda-rds',
      subnetIds: [
        subnet1APrivate.id,
        subnet1CPrivate.id
      ]
    })
  }
}

const app = new App();
new MyStack(app, "lambda-rds");
app.synth();
