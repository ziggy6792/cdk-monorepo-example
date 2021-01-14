/* eslint-disable import/prefer-default-export */
import { Construct, Stage, StageProps } from '@aws-cdk/core';

import * as cdk from '@aws-cdk/core';
import * as defaults from '@aws-solutions-constructs/core';
import * as path from 'path';
import { DEPLOYMENT_CONFIG } from 'config';
import { DeploymentStack } from './deployment-stack';

export interface DeploymentStageProps extends cdk.StackProps {
  readonly stageName: string;
}

export class DeploymentStage extends Stage {
  public readonly urlOutput: cdk.CfnOutput;
  // public stack: ApigwDemoStack;

  constructor(scope: Construct, id: string, props?: DeploymentStageProps) {
    super(scope, id, props);

    const { stageName } = props;

    const stageConfig = DEPLOYMENT_CONFIG[stageName];

    const stack = new DeploymentStack(this, 'deployment', {
      stageName,
      ...stageConfig,
    });

    // defaults.printWarning(websiteFolder);

    // this.stack = service;
    // this.urlOutput = new cdk.CfnOutput(scope, `${stackName}-${id}`, { value: Fn.importValue('url') });
    // this.urlOutput = new cdk.CfnOutput(this, `${stackName}-${id}`, { value: service.urlOutput });
  }
}
