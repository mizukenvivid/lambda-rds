import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from '@cdktf/provider-aws/lib/provider'

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here
    new AwsProvider(this, 'aws', {
      region: 'ap-northeast-1'
    })
  }
}

const app = new App();
new MyStack(app, "lambda-rds");
app.synth();
