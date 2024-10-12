#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/bot-vpc';

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'main-broken-gm-bot-vpc-network');
