import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from '@cdktf/provider-aws/lib/provider'
import { Vpc } from "@cdktf/provider-aws/lib/vpc";
import { Subnet } from "@cdktf/provider-aws/lib/subnet";
import { DbSubnetGroup } from "@cdktf/provider-aws/lib/db-subnet-group";
import { DbParameterGroup } from "@cdktf/provider-aws/lib/db-parameter-group";
import { DbInstance } from "@cdktf/provider-aws/lib/db-instance";

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

    new DbParameterGroup(this, 'db-parameter-group', {
      name: 'cdktf-lambda-rds',
      family: 'mysql8.0',
      parameter: [
        {
          name: 'character_set_server',
          value: 'utf8mb4'
        },
        {
          name: 'collation_server',
          value: 'utf8mb4_unicode_ci'
        }
      ]
    })

    const db = new DbInstance(this, 'db-instance', {
      engine: 'mysql',
      engineVersion: '8.0.33',
      identifier: 'cdktf-lambda-rds',
      username: 'admin',
      password: 'password',
      instanceClass: 'db.t3.micro',
      allocatedStorage: 20,
      dbSubnetGroupName: 'cdktf-lambda-rds',
      publiclyAccessible: false, 
      vpcSecurityGroupIds: [
        vpc.defaultSecurityGroupId
      ],
      caCertIdentifier: 'rds-ca-2019',
      parameterGroupName: 'cdktf-lambda-rds',
    })
  }
}

const app = new App();
new MyStack(app, "lambda-rds");
app.synth();
