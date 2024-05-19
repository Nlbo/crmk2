import {Component, OnInit} from '@angular/core';
import {ChainsContentManageModel} from '@shared/api/content/req/chains-content-manage.model';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ContentService} from '@api/content/content.service';
import {IContentModel} from '@api/content/res/content.interface';

@Component({
  selector: 'app-chains-content-manage',
  templateUrl: './chains-content-manage.component.html',
  styleUrls: ['./chains-content-manage.component.scss']
})
export class ChainsContentManageComponent implements OnInit {
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneChainContent$ = of(false);
  isManagingChainContent = false;
  isVisibleButtonsContainer: boolean = false;
  chainsContentManageModel = new ChainsContentManageModel();

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private contentService: ContentService) {
  }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((parentParams: Params) => {
      if (parentParams.telegramBotId) {
        this.chainsContentManageModel.telegramBotId.setValue(parentParams.telegramBotId);
        this.chainsContentManageModel.chainId.setValue(parentParams.chainId);
        this.activatedRoute.params.subscribe((childParams: Params) => {
          if (childParams.id) {
            this.chainsContentManageModel.id.setValue(childParams.id);
            this.ManageType = ManageTypesEnum.Edit;
            this.isGettingOneChainContent$ = of(true);
            this.contentService.getOneContent(parentParams.chainId, childParams.id).subscribe((chainContent: IContentModel) => {
              this.isGettingOneChainContent$ = of(false);
              if (chainContent) {
                this.chainsContentManageModel.attachments.setValue(chainContent.attachments[0]);
                this.chainsContentManageModel.attachmentId.setValue(chainContent.attachments[0]?.file_id);
                this.chainsContentManageModel.stickers.setValue(chainContent.stickers[0]?.id);
                this.chainsContentManageModel.body.setValue(chainContent.body);
                this.chainsContentManageModel.title.setValue(chainContent.title);
                if (chainContent.buttons?.length) {
                  this.chainsContentManageModel.buttons.setValue({
                    url: chainContent.buttons[0].url,
                    text: chainContent.buttons[0].text
                  });
                  this.openButtonsModal();
                }
                if (this.router.url.includes(ManageTypesEnum.Preview)) {
                  this.ManageType = ManageTypesEnum.Preview;
                  this.chainsContentManageModel.manageAllFields(false);
                }
              }
            }, err => {
              this.isGettingOneChainContent$ = of(false);
            });
          }
        });
      }
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingChainContent = true;
        this.contentService.createContent(this.chainsContentManageModel.getCreateValues(), this.chainsContentManageModel.chainId.value).subscribe(() => {
          this.router.navigate(['', 'bots', this.chainsContentManageModel.telegramBotId.value, 'chains', this.chainsContentManageModel.chainId.value, 'content']);
          this.isManagingChainContent = false;
        }, err => this.isManagingChainContent = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingChainContent = true;
        this.contentService.editContent(this.chainsContentManageModel.getEditValues(), this.chainsContentManageModel.chainId.value, this.chainsContentManageModel.id.value).subscribe(() => {
          this.router.navigate(['', 'bots', this.chainsContentManageModel.telegramBotId.value, 'chains', this.chainsContentManageModel.chainId.value, 'content']);
          this.isManagingChainContent = false;
        }, err => this.isManagingChainContent = false);
        break;
    }
  }

  openButtonsModal() {
    this.isVisibleButtonsContainer = true;
  }

  closeButtonsModal() {
    this.chainsContentManageModel.buttons.setValue(null);
    this.isVisibleButtonsContainer = false;
  }
}
