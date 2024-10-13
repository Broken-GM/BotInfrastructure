#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/bot-vpc';
import { EcrStack } from '../lib/bot-ecr';
import { EcsStack } from '../lib/bot-ecs';

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'main-broken-gm-bot-vpc-network');
const ecrStack = new EcrStack(app, 'main-broken-gm-bot-ecr');
const ecsStack = new EcsStack(app, 'main-broken-gm-bot-ecs', {
    ecrRepoName: ecrStack.ecrRepoName,
    vpc: vpcStack.vpc,
    subnet: vpcStack.privateSubnet
});